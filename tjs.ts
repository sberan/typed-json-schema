import { Union, Object } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonObject = {[key: string]: AnyJson }
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

type Specify<T, S extends T> = T extends S ? never : S

type NonNull<T> = Exclude<T, undefined | null | void>

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

export type JsonObject<S extends { properties: AnyJsonObject, required?: string, additionalProperties?: boolean }> = 
  (S extends { additionalProperties: false } ? { } : { [key: string]: AnyJson })
  & {[P in Exclude<keyof S['properties'], Specify<string, NonNull<S['required']>>>]?: Exclude<S['properties'][P], undefined> }
  & {[P in Extract<keyof S['properties'], Specify<string, NonNull<S['required']>>>]: Exclude<S['properties'][P], undefined> }

type CleanJsonObjectSpec<S extends { properties: AnyJsonObject, required: string }> = S['required'] extends never ? { properties: S['properties'] } : S

type TypeName = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'

type JsonSchemaInput = TypeName | {
  type?: TypeName | ReadonlyArray<TypeName>
  const?: AnyJson
  items?: JsonSchemaInput
  allOf?: ReadonlyArray<JsonSchemaInput>
  oneOf?: ReadonlyArray<JsonSchemaInput>
  properties?: {[key: string]: JsonSchemaInput}
  required?: ReadonlyArray<string>
}

type SingleTypeName<S extends TypeName> = { type: S }
type MultiTypeName<S extends TypeName> = { type: ReadonlyArray<S> }

type JsonSchemaSpec = {
  type: TypeName
  items: JsonSchemaSpec
  const: AnyJson
  properties: {[key: string]: JsonSchemaSpec}
  required: string
}

type SpecOf<S extends JsonSchemaInput> = {
  type: S extends TypeName ? S
      : S extends SingleTypeName<infer T> ? T
      : S extends MultiTypeName<infer T> ? T
      : TypeName
  items: S extends { items: infer I } ? SpecOf<I> : JsonSchemaSpec
  const: S extends { const: infer T } ? T : AnyJson
  properties: S extends { properties: infer T } ? {- readonly [P in keyof T]: SpecOf<T[P]> } : {}
  required: S extends { required: ReadonlyArray<infer T> } ? T extends string ? T : never : never
} & (
  S extends { allOf: infer T }
    ? Union.IntersectOf<{[P in keyof T]: SpecOf<T[P]>}[Extract<keyof T, number>]>
    : {}
) & (
  S extends { oneOf: infer T }
    ? {[P in keyof T]: SpecOf<T[P]>}[Extract<keyof T, number>]
    : {}
) & (
  S extends { anyOf: infer T }
    ? {[P in keyof T]: SpecOf<T[P]>}[Extract<keyof T, number>]
    : {}
)

type TypeOf<S extends JsonSchemaSpec> = AnyJson extends S['const']
  ? {
      string: string
      number: number
      boolean: boolean
      null: null
      array: S extends { items: infer I }
        ? I extends JsonSchemaSpec
          ? JsonSchemaSpec extends I
            ? AnyJsonArray
            : TypeOf<I>[]
          : AnyJsonArray
        : AnyJsonArray
      object: {} extends S['properties'] ? AnyJsonObject : JsonObject<CleanJsonObjectSpec<{ 
        properties: {[P in keyof S['properties']]: TypeOf<S['properties'][P]> }
        required: S['required']
      }>>
    }[S['type']]
  : S['const']

export function validate<S extends JsonSchemaInput>(schema: S): CleanJson<TypeOf<SpecOf<S>>> { throw 'nope'}