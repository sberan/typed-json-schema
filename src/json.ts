
import { Any, Object } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonValue = AnyJson | undefined
export type AnyJsonObject = {[key: string]: AnyJsonValue}
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

export type JSONTypeName = 'null' |'string' |'number' |'boolean' |'object' |'array'

type Lookup<T, P, Default> = P extends keyof T ? NonNullable<T[P]> : Default
type Lookup2<T, P1, P2, Default> = Lookup<Lookup<T, P1, Default>, P2, Default>

type JsonSpec = {
  properties?: {[key:string] : AnyJson}
  required?: string
  additionalProperties?: boolean | { type: AnyJson }
  items?: AnyJsonArray
  type?: JSONTypeName
}

type ObjectSpecProperties<Spec extends JsonSpec> = 
  ({} extends Lookup<Spec, 'properties', {}> ? never : 'properties')
  | (Lookup<Spec, 'required', never> extends never ? never : 'required')
  | (true extends Lookup<Spec, 'additionalProperties', true> ? never : 'additionalProperties')

type DefinedProperties<T extends JsonSpec> =
  Lookup<T, 'properties', {}>

type RequiredUnknownKeys<T extends JsonSpec> =
  Exclude<RequiredKeys<T>, keyof DefinedProperties<T>> 

type RequiredKeys<T extends JsonSpec> =
  Lookup<T, 'required', never>

export type JsonObject<T extends JsonSpec> = 
  AdditionalPropertiesTypeOf<T>
  & Object.Pick<DefinedProperties<T>, RequiredKeys<T>>
  & Omit<Partial<DefinedProperties<T>>, RequiredKeys<T>>
  & {[P in RequiredUnknownKeys<T>]: AnyJson}

type AdditionalPropertiesTypeOf<Spec extends JsonSpec> =
  false extends Lookup<Spec, 'additionalProperties', true> ? {} : {
    [key: string]: Lookup2<Spec, 'additionalProperties', 'type', AnyJsonValue>
  }

type JsonObjectTypeOf<Spec extends JsonSpec> =
  ObjectSpecProperties<Spec> extends never ? AnyJsonObject: JsonObject<{[P in ObjectSpecProperties<Spec>]: Spec[P]}>

export type JSONTypeOf<Spec extends JsonSpec> = {
  '1': {
    null: null
    string: string
    number: number
    boolean: boolean
    object: JsonObjectTypeOf<Spec>
    array: Lookup<Spec, 'items', AnyJsonArray>
    any: AnyJson
  }[Lookup<Spec, 'type', 'any'>]
}['1']