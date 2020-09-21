
import { Object } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonValue = AnyJson | undefined
export type AnyJsonObject = {[key: string]: AnyJsonValue}
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

export type JSONTypeName = 'null' |'string' |'number' |'boolean' |'object' |'array'

type Lookup<T, P, Default> = P extends keyof T ? NonNullable<T[P]> : Default
type Lookup2<T, P1, P2, Default> = Lookup<Lookup<T, P1, Default>, P2, Default>

export type Keywords = {
  type?: JSONTypeName
  const?: AnyJson
  properties?: {[key: string]: Keywords }
  required?: string
  additionalProperties?: boolean | Keywords
  items?: Keywords
}

type JsonObjectSpec = {
  required?: string
  properties?: {[key: string]: AnyJson}
  additionalProperties?: boolean | { type: AnyJson }
}

type DefinedProperties<T extends JsonObjectSpec> =
  Lookup<T, 'properties', {}>

type RequiredUnknownKeys<T extends JsonObjectSpec> =
  Exclude<RequiredKeys<T>, keyof DefinedProperties<T>>

type RequiredKeys<T extends { required?: string }> =
  Lookup<T, 'required', never>

type AdditionalPropertiesTypeOf<Spec extends JsonObjectSpec> =
  false extends Lookup<Spec, 'additionalProperties', true> ? {} : {
    [key: string]: Lookup2<Spec, 'additionalProperties', 'type', AnyJsonValue>
  }

export type JsonObject<T extends JsonObjectSpec> = 
  AdditionalPropertiesTypeOf<T>
  & Object.Pick<DefinedProperties<T>, RequiredKeys<T>>
  & Omit<Partial<DefinedProperties<T>>, RequiredKeys<T>>
  & {[P in RequiredUnknownKeys<T>]: AnyJson}

type OmitUndefined<T> = Omit<T, {[P in keyof T]: T[P] extends undefined ? P : never }[keyof T]>

type ItemsKeyword<Items extends Keywords> = { items: Items }
type TypeKeyword<K extends Keywords> = K extends { type: JSONTypeName } ? K['type'] : JSONTypeName
type PropertiesKeyword<Properties extends {[key: string]: Keywords}> = { properties: {} extends Properties ? never : Properties }
type RequiredKeyword<Required extends string> = { required: Required }
type AdditionalPropertiesKeyword<AdditionalProperties extends false | Keywords> = { additionalProperties: AdditionalProperties }

type PropertiesSpec<Properties extends {[key: string]: Keywords}> = {calc: {[P in keyof Properties]: JsonValue<Properties[P]>['calc']} }
type AdditionalPropertiesSpec<AdditionalProperties extends false | Keywords> = AdditionalProperties extends Keywords ? { type: JsonValue<AdditionalProperties>['calc'] } : false

type JsonObjectSpecValue<K extends Keywords> = OmitUndefined<{
  properties: K extends PropertiesKeyword<infer Properties> ? PropertiesSpec<Properties>['calc'] : undefined
  required: K extends RequiredKeyword<infer Required> ? Required : undefined
  additionalProperties: K extends AdditionalPropertiesKeyword<infer AdditionalProperties> ? AdditionalPropertiesSpec<AdditionalProperties> : undefined
}>

type JsonString<K extends Keywords> = 'string' extends TypeKeyword<K> ? string : never

type JsonNumber<K extends Keywords> = 'number' extends TypeKeyword<K> ? number : never

type JsonBoolean<K extends Keywords> = 'boolean' extends TypeKeyword<K> ? boolean : never

type JsonNull<K extends Keywords> = 'null' extends TypeKeyword<K> ? null : never

type JsonObjectValue<K extends Keywords> =
  'object' extends TypeKeyword<K>
    ? keyof JsonObjectSpecValue<K> extends never
      ? AnyJsonObject
      : JsonObject<{[P in keyof JsonObjectSpecValue<K>]: JsonObjectSpecValue<K>[P]}>
    : never

type JsonArray<K extends Keywords> =
  'array' extends TypeKeyword<K>
    ? K extends ItemsKeyword<infer Items>
      ? JsonValue<Items>['calc'][]
      : AnyJsonArray
    : never
  
type JsonValue<K extends Keywords> = {
  calc: JsonString<K> | JsonBoolean<K> | JsonNumber<K> | JsonNull<K> | JsonObjectValue<K> | JsonArray<K>
}

export type TypeOf<K extends Keywords> = JsonValue<K>['calc']