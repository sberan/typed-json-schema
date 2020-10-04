export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonValue = AnyJson | undefined
export type AnyJsonObject = {[key: string]: AnyJsonValue}
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

export namespace ObjectSpec {

  export type Required<Required extends string> =
    { required: Required }

  export type Properties<Properties extends { [key: string]: AnyJson }> =
    { properties: Properties }

  export type AdditionalPropertiesFalse =
    { additionalProperties: false }

  export type AdditionalPropertiesType<T extends AnyJson> =
    { additionalProperties: { type: T } }

}

type JsonObjectSpec = {
  required?: string
  properties?: { [key: string]: AnyJson }
  additionalProperties?: false | AnyJson
}

type AdditionalPropertiesTypeOf<Spec extends JsonObjectSpec> =
  Spec extends ObjectSpec.AdditionalPropertiesFalse
    ? {}
    : {[key: string]: Spec extends ObjectSpec.AdditionalPropertiesType<infer T> ? T : AnyJsonValue }

type PropertiesTypeOf<Properties extends {[key:string]: AnyJson}, Required extends string> =
  {[P in Extract<keyof Properties, Required>]: Properties[P]}
  & {[P in Exclude<keyof Properties, Required>]?: Properties[P]}
  & {[P in Exclude<Required, keyof Properties>]: AnyJson}

export type JsonObject<Spec extends JsonObjectSpec> =
  PropertiesTypeOf<
    Spec extends ObjectSpec.Properties<infer P> ? P : {}, 
    Spec extends ObjectSpec.Required<infer R> ? R : never
  >
  & AdditionalPropertiesTypeOf<Spec>