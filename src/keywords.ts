import { AnyJson, AnyJsonArray, AnyJsonObject, JsonObject } from "./json"

type OmitUndefined<T> = Omit<T, {[P in keyof T]: T[P] extends undefined ? P : never }[keyof T]>

export type JSONTypeName = 'null' |'string' |'number' |'boolean' |'object' |'array'

export type Keywords = {
  type?: JSONTypeName
  const?: AnyJson
  properties?: {[key: string]: Keywords }
  required?: string
  additionalProperties?: boolean | Keywords
  items?: Keywords
}

type ItemsKeyword<Items extends Keywords> = { items: Items }
type TypeKeyword<K extends Keywords> = K extends { type: JSONTypeName } ? K['type'] : JSONTypeName
type PropertiesKeyword<Properties extends {[key: string]: Keywords}> = { properties: {} extends Properties ? never : Properties }
type RequiredKeyword<Required extends string> = { required: Required }
type AdditionalPropertiesKeyword<AdditionalProperties extends false | Keywords> = { additionalProperties: AdditionalProperties }
type ConstKeyword<T extends AnyJson> = { const: T }

type PropertiesSpec<Properties extends {[key: string]: Keywords}> = {
  calc: {[P in keyof Properties]: JsonValue<Properties[P]>['calc']}
}

type AdditionalPropertiesSpec<AdditionalProperties extends false | Keywords> =
  AdditionalProperties extends Keywords ? { type: JsonValue<AdditionalProperties>['calc'] } : false

type JsonObjectSpec<K extends Keywords> = OmitUndefined<{
  properties: K extends PropertiesKeyword<infer Properties> ? PropertiesSpec<Properties>['calc'] : undefined
  required: K extends RequiredKeyword<infer Required> ? Required : undefined
  additionalProperties: K extends AdditionalPropertiesKeyword<infer AdditionalProperties> ? AdditionalPropertiesSpec<AdditionalProperties> : undefined
}>

type StringValue<K extends Keywords> = 'string' extends TypeKeyword<K> ? string : never

type NumberValue<K extends Keywords> = 'number' extends TypeKeyword<K> ? number : never

type BooleanValue<K extends Keywords> = 'boolean' extends TypeKeyword<K> ? boolean : never

type NullValue<K extends Keywords> = 'null' extends TypeKeyword<K> ? null : never

type ObjectValue<K extends Keywords> =
  'object' extends TypeKeyword<K>
    ? keyof JsonObjectSpec<K> extends never
      ? AnyJsonObject
      : JsonObject<{[P in keyof JsonObjectSpec<K>]: JsonObjectSpec<K>[P]}>
    : never

type ArrayValue<K extends Keywords> =
  'array' extends TypeKeyword<K>
    ? K extends ItemsKeyword<infer Items>
      ? JsonValue<Items>['calc'][]
      : AnyJsonArray
    : never
  
type JsonValue<K extends Keywords> = {
  calc: keyof K extends never ? AnyJson
  : K extends ConstKeyword<infer Const> ? Const
  : StringValue<K> | BooleanValue<K> | NumberValue<K> | NullValue<K> | ObjectValue<K> | ArrayValue<K>
}

export type TypeOf<K extends Keywords> = JsonValue<K>['calc']