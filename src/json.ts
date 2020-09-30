
export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonValue = AnyJson | undefined
export type AnyJsonObject = {[key: string]: AnyJsonValue}
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

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