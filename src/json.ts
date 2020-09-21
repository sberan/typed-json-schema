
export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonValue = AnyJson | undefined
export type AnyJsonObject = {[key: string]: AnyJsonValue}
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

export type JSONTypeName = 'null' |'string' |'number' |'boolean' |'object' |'array'

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

type DefinedProperties<T extends {[key:string]: AnyJson }> = { properties: T }

type RequiredKeys<T extends string> = { required: T }

type AdditionalPropertiesType<T extends AnyJson> = { additionalProperties: { type: T } }

type AdditionalPropertiesTypeOf<Spec extends JsonObjectSpec> =
  Spec extends { additionalProperties: false }
    ? {}
    : {[key: string]: Spec extends AdditionalPropertiesType<infer T> ? T : AnyJsonValue }

type PropertiesTypeOf<Properties extends {[key:string]: AnyJson}, Required extends string> =
  {[P in Extract<keyof Properties, Required>]: Properties[P]}
  & {[P in Exclude<keyof Properties, Required>]?: Properties[P]}
  & {[P in Exclude<Required, keyof Properties>]: AnyJson}

export type JsonObject<Spec extends JsonObjectSpec> = 
  PropertiesTypeOf<
    Spec extends DefinedProperties<infer P> ? P : {}, 
    Spec extends RequiredKeys<infer R> ? R : never
  >
  & AdditionalPropertiesTypeOf<Spec>

type OmitUndefined<T> = Omit<T, {[P in keyof T]: T[P] extends undefined ? P : never }[keyof T]>

type ItemsKeyword<Items extends Keywords> = { items: Items }
type TypeKeyword<K extends Keywords> = K extends { type: JSONTypeName } ? K['type'] : JSONTypeName
type PropertiesKeyword<Properties extends {[key: string]: Keywords}> = { properties: {} extends Properties ? never : Properties }
type RequiredKeyword<Required extends string> = { required: Required }
type AdditionalPropertiesKeyword<AdditionalProperties extends false | Keywords> = { additionalProperties: AdditionalProperties }

type PropertiesSpec<Properties extends {[key: string]: Keywords}> = {
  calc: {[P in keyof Properties]: JsonValue<Properties[P]>['calc']}
}

type AdditionalPropertiesSpec<AdditionalProperties extends false | Keywords> =
  AdditionalProperties extends Keywords ? { type: JsonValue<AdditionalProperties>['calc'] } : false

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
  calc: keyof K extends null ? AnyJson : JsonString<K> | JsonBoolean<K> | JsonNumber<K> | JsonNull<K> | JsonObjectValue<K> | JsonArray<K>
}

export type TypeOf<K extends Keywords> = JsonValue<K>['calc']