import { Union } from 'ts-toolbelt'
import Ajv from 'ajv'

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
  & {[P in Exclude<keyof S['properties'], NonNullable<S extends { required: infer R} ? NonNullable<R> : never>>]?: Exclude<S['properties'][P], undefined> }
  & {[P in Extract<keyof S['properties'], NonNullable<S extends { required: infer R} ? NonNullable<R> : never>>]: Exclude<S['properties'][P], undefined> }

type CleanJsonObjectNode<S extends { properties: AnyJsonObject, required: string, additionalProperties: boolean }> = Compute<
  Pick<S,
    'properties'
    | (S['required'] extends never ? never : 'required' )
    | (S['additionalProperties'] extends false ? 'additionalProperties' : never)
  >
>

type TypeName = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'

export type JsonSchemaInput = TypeName | {
  type?: TypeName | ReadonlyArray<TypeName>
  const?: AnyJson
  enum?: ReadonlyArray<AnyJson>
  items?: JsonSchemaInput
  allOf?: ReadonlyArray<JsonSchemaInput>
  oneOf?: ReadonlyArray<JsonSchemaInput>
  anyOf?: ReadonlyArray<JsonSchemaInput>
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
  S extends { required: ReadonlyArray<infer T> } ? { required: T extends string ? T : never } : {}
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

const schemaValueKeys = [
  'items',
  'additionalProperties',
  'propertyNames',
  'additionalItems',
  'contains',
  'if',
  'then',
  'else',
  'oneOf',
  'anyOf',
  'allOf'
]

const schemaObjectValueKeys = [
  'properties',
  'patternProperties',
  'dependencies',
  'definitions'
]

function preProcessSchema (schema: any, schemaKeys = schemaValueKeys, schemaObjectKeys = schemaObjectValueKeys): any {
  if (typeof schema === 'string') {
    return { type: schema }
  }

  if (Array.isArray(schema)) {
    return schema.map(x => preProcessSchema(x))
  }

  if (typeof schema === 'object') {
    schemaKeys.forEach(key => {
      if (key in schema) {
        schema[key] = preProcessSchema(schema[key])
      }
    })
    schemaObjectKeys.forEach(key => {
      const value = schema[key]
      if (value && typeof value === 'object' && !Array.isArray(value) ) {
        schema[key] = preProcessSchema(value, Object.keys(value), [])
      }
    })
  }
  return schema
}

interface Validator<T> {
  validate(input: any): Promise<T>
}

interface Schema<S extends JsonSchemaInput> extends Validator<TypeOf<S>> { }

export function schema<S extends JsonSchemaInput>(schema: S): Schema<S> {
  const ajv = new Ajv(),
    processedSchema = preProcessSchema(schema)
  return {
    validate(input: any) {
      const valid = ajv.validate(processedSchema, input)
      if (valid) {
        return Promise.resolve(input as TypeOf<S>)
      }
      return Promise.reject({ errors: ajv.errors })
    }
  }
}

export const Struct = <Properties extends {readonly [key: string]: JsonSchemaInput }, OptionalKeys extends string> (properties: Properties, options: { optional?: OptionalKeys[] } = {}) => {
  const optionalKeys = options.optional ? options.optional : []
  const requiredKeys = Object.keys(properties).filter(x => !(optionalKeys as string[]).includes(x)) as Exclude<Extract<keyof Properties, string>, string extends OptionalKeys ? never : OptionalKeys>[]
  const structInput = {
    type: 'object',
    properties,
    additionalProperties: false,
    required: requiredKeys,
    ...options
  } as const
  type ObjectType = TypeOf<typeof structInput>
  const structSchema = schema(structInput)
  return class {
    static schema = structSchema
    constructor (data: ObjectType) {
      Object.assign(this, data)
    }

    static validate (input: any) {
      return structSchema.validate(input)
    }

  } as any as Validator<ObjectType> & { new(data: ObjectType): ObjectType }
}

export type schema<T> = T extends Validator<infer U> ? U : never
