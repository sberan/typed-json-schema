import {  Union } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonObject = {[key: string]: AnyJson }
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

type Compute<A extends any> = A extends Function ? A : {
  [K in keyof A]: A[K];
} & {};

export type IntersectionOf<U extends any> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type CombineConstants<A, B> = AnyJson extends A ? B 
  : A extends B ? A
  : B extends A ? A
  : never

type CleanJson<T extends AnyJson> =
  T extends AnyJsonArray
    ? Exclude<keyof T, keyof AnyJsonArray> extends never
      ? T
      : never
    : T extends AnyJsonObject
      ? T extends AnyJsonPrimitive
        ? never
        : T
      : T

export type JsonObject<S extends { properties: AnyJsonObject, required?: string, additionalProperties?: false }> = 
  (S extends { additionalProperties: false } ? { } : { [key: string]: AnyJson })
  & {[P in Exclude<keyof S['properties'], NonNullable<S['required']>>]?: Exclude<S['properties'][P], undefined> }
  & {[P in Extract<keyof S['properties'], NonNullable<S['required']>>]: Exclude<S['properties'][P], undefined> }

type CleanJsonObjectNode<S extends { properties: AnyJsonObject, required: string, additionalProperties: boolean }> = Compute<
  Pick<S,
    'properties'
    | (S['required'] extends never ? never : 'required' )
    | (S['additionalProperties'] extends false ? 'additionalProperties' : never)
  >
>

type TypeName = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'

type JsonSchemaInput = TypeName | {
  type?: TypeName | ReadonlyArray<TypeName>
  const?: AnyJson
  enum?: ReadonlyArray<AnyJson>
  items?: JsonSchemaInput
  allOf?: ReadonlyArray<JsonSchemaInput>
  oneOf?: ReadonlyArray<JsonSchemaInput>
  properties?: {[key: string]: JsonSchemaInput}
  required?: ReadonlyArray<string>
  additionalProperties?: boolean
}

type SingleTypeName<S extends TypeName> = { type: S }

type MultiTypeName<S extends TypeName> = { type: ReadonlyArray<S> }

type SchemaNode = {
  type?: TypeName
  items: SchemaNode
  const?: AnyJson
  enum?: AnyJson
  properties: {[key: string]: SchemaNode}
  required?: string
  additionalProperties: boolean
}

type SchemaNodeOf<S extends JsonSchemaInput> = (
  S extends TypeName ? { type: S }
  : S extends SingleTypeName<infer T> ? { type: T }
  : S extends MultiTypeName<infer T> ? { type: T }
  : { }
) & (
  S extends { const: infer T } ? { const: T } : {}
) & (
  S extends { enum: ReadonlyArray<infer T> } ? { enum: T } : {}
) & (
  S extends { required: ReadonlyArray<infer T> } ? T extends string ? { required: T } : {} : {}
) & ({
  items: S extends { items: infer I } ? SchemaNodeOf<I> : SchemaNode
  properties: S extends { properties: infer T } ? {- readonly [P in keyof T]: SchemaNodeOf<T[P]> } : {}
  additionalProperties: S extends { additionalProperties: false } ? false : boolean
}) & (
  S extends { allOf: infer T }
    ? Union.IntersectOf<{[P in keyof T]: SchemaNodeOf<T[P]>}[Extract<keyof T, number>]>
    : {}
) & (
  S extends { oneOf: infer T }
    ? Union.Merge<{[P in keyof T]: SchemaNodeOf<T[P]>}[Extract<keyof T, number>]>
    : {}
) & (
  S extends { anyOf: infer T }
    ? Union.Merge<{[P in keyof T]: SchemaNodeOf<T[P]>}[Extract<keyof T, number>]>
    : {}
)

type ComputedType<S extends SchemaNode> =
  CombineConstants<
    CombineConstants<
      S extends { const: infer C } ? C : AnyJson,
      S extends { enum: infer C } ? C : AnyJson
    >
  ,
  S extends { type: infer T }
    ?
      {
        string: string
        number: number
        boolean: boolean
        null: null
        array: S extends { items: infer I }
          ? I extends SchemaNode
            ? SchemaNode extends I
              ? AnyJsonArray
              : ComputedType<I>[]
            : AnyJsonArray
          : AnyJsonArray
        object: {} extends S['properties'] ? AnyJsonObject : JsonObject<CleanJsonObjectNode<{ 
          properties: {[P in keyof S['properties']]: ComputedType<S['properties'][P]> }
          required: S extends { required: infer R } ? R extends string ? R : never : never
          additionalProperties: S['additionalProperties']
        }>>
      }[Extract<TypeName, T>]
    : AnyJson
>

export type TypeOf<S extends JsonSchemaInput> = CleanJson<ComputedType<SchemaNodeOf<S>>>

export function validate<S extends JsonSchemaInput>(schema: S, obj?: any): TypeOf<S> { throw 'nope'}


const asdf: TypeOf<{
  type: 'object',
  properties: {
    a: 'string'
    b: 'string'
  },
  required: readonly ['a']
}> = null as any

export const Struct = <Properties extends {readonly [key: string]: JsonSchemaInput }> (properties: Properties) => {
    const structSchema = {
      type: 'object',
      properties,
      additionalProperties: false
    } as const
    type ObjectType = TypeOf<typeof structSchema>
    return class {
      static schema = structSchema
      constructor (data: ObjectType) {
        
      }
    } as any as { schema: ObjectType } & { new(data: ObjectType): ObjectType }
}

class Person extends Struct(<const>{
  a: {type: 'object', properties: { a: 'string'}},
  b: 'number'
}) {}

Person.schema.a.a
const x = new Person({a: {}, b: 42 })