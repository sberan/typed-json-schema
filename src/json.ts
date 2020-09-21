
import { Key } from 'Iteration/Key'
import { Any, Object } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonValue = AnyJson | undefined
export type AnyJsonObject = {[key: string]: AnyJsonValue}
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

export type JSONTypeName = 'null' |'string' |'number' |'boolean' |'object' |'array'

type Lookup<T, P, Default> = P extends keyof T ? NonNullable<T[P]> : Default
type Lookup2<T, P1, P2, Default> = Lookup<Lookup<T, P1, Default>, P2, Default>

type Keywords = {
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

type RequiredKeys<T extends JsonObjectSpec> =
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

type JsonString<K extends Keywords> = 'string' extends Lookup<K, 'type', 'string'> ? string : never

type JsonNumber<K extends Keywords> = 'number' extends Lookup<K, 'type', 'number'> ? number : never

type JsonBoolean<K extends Keywords> = 'boolean' extends Lookup<K, 'type', 'boolean'> ? boolean : never

type JsonNull<K extends Keywords> = 'null' extends Lookup<K, 'type', 'null'> ? null : never

type JsonObjProperty<K extends Keywords, P extends string> =
  'properties' extends keyof K ? P extends keyof K['properties'] ? K['properties'][P] : {} : {}

type JsonObjAdditionalType<K extends boolean | Keywords> =
  false extends K ? {} : {[key: string]: K extends Keywords ? JsonValue<K>['type'] : AnyJson }

type JsonObjAdditional<K extends Keywords> = {
  type: JsonObjAdditionalType<Lookup<K, 'additionalProperties', true>>
}

type JsonObjRequired<K extends Keywords> = {
  type: {[P in Lookup<K, 'required', never>]: JsonValue<JsonObjProperty<K, P>>['type'] }
}
    
type JsonObjOptional<K extends Keywords> = {
  type: {[P in Extract<Exclude<keyof Lookup<K, 'properties', {}>, Lookup<K, 'required', never>>, string>]?: JsonObjProperty<K, P> }
}

type JsonObjProperties<K extends Keywords> = {
  type: JsonObjRequired<K>['type'] & JsonObjOptional<K>['type'] & JsonObjAdditional<K>['type']
}

type JsonObjectAdditionalSpec<K extends Keywords | boolean> =
  K extends Keywords ? { type: JsonValue<K>['type'] } : K

type JsonObjectPropertiesSpec<Properties extends {[key: string]: Keywords}> = {
  calc: {[P in keyof Properties]: JsonValue<Properties[P]>['type']}
}


// type JsonObjectSpecValue<K extends Keywords> = {
//   'calc': {
//     required: Lookup<K, 'required', never>
//     additionalProperties: false//JsonObjectAdditionalSpec<Lookup<K, 'additionalProperties', true>>
//     properties: J['calc']
//   }
// }


type JsonObjectSpecValue<K extends Keywords> = {
  properties: JsonObjectPropertiesSpec<Lookup<K, 'properties', {}>>
  required: Lookup<K, 'required', never>
  additionalProperties: JsonObjectAdditionalSpec<Lookup<K, 'additionalProperties', true>>
}

type JsonObjectValue<K extends Keywords> = 'object' extends Lookup<K, 'type', 'object'>
  ? JsonObject<JsonObjectSpecValue<K>>
  : never

type JsonValue<K extends Keywords> = {
  type: JsonString<K> | JsonNumber<K> | JsonBoolean<K> | JsonNull<K> | JsonArray<K> | JsonObjectValue<K>
}

type JsonArray<K extends Keywords> = 'array' extends Lookup<K, 'type', 'array'>
  ? Lookup<K, 'items', never> extends never ? AnyJsonArray : JsonValue<Lookup<K, 'items', never>>['type'][]
  : never


type A = JsonValue<{ type: 'array', items: { type: 'string' } }>['type']
type O = JsonValue<{ type: 'number' | 'string' | 'array' | 'object', properties: { a: { type: 'string' }, b: {} }, required: 'a' | 'c', additionalProperties: { type: 'string' }}>['type']
// enum: AnyJson
// oneOf: Keywords[]
// anyOf: Keywords[]
// allOf: Keywords[]

// type ToPropertiesSpec<Properties extends {[key: string]: Keywords}> = {'1': {[P in keyof Properties]: TypeOf<Properties[P]>}}

// type ToAdditionalPropertiesSpec<AdditionalProperties extends boolean | Keywords> = AdditionalProperties extends Keywords ? { type: TypeOf<AdditionalProperties>} : Extract<AdditionalProperties, boolean>

// type ToSpec<K extends Keywords> = {'1': {[P in keyof K]: 
//   P extends 'properties' ? ToPropertiesSpec<Lookup<K, 'properties', {}>>['1']
//   : P extends 'additionalProperties' ? ToAdditionalPropertiesSpec<Lookup<K, 'additionalProperties', true>>
//   : NonNullable<K[P]> } }

export type TypeOf<K extends Keywords> = JsonValue<K>