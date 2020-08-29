import { Object } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonValue = AnyJson | undefined
export type AnyJsonObject = {[key: string]: AnyJsonValue}
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

interface ObjectSpec {
  properties?: {[key:string] : AnyJson}
  required?: string
  additionalProperties?: boolean
  items?: AnyJsonArray
}

type MinimalObjectSpec<T extends ObjectSpec> = {'1': {[P in 
  ('properties' extends keyof T ? {} extends T['properties'] ? never : 'properties' : never)
  | ('required' extends keyof T ? (T['required'] extends never ? never : 'required') : never)
  | ('additionalProperties' extends keyof T ? (T['additionalProperties'] extends never ? never : 'additionalProperties') : never)
]: T[P]}}['1']

type DefinedProperties<T extends ObjectSpec> =
  'properties' extends keyof T ? NonNullable<T['properties']> : {}

type RequiredUnknownKeys<T extends ObjectSpec> =
  Exclude<RequiredKeys<T>, keyof DefinedProperties<T>>

type RequiredKeys<T extends ObjectSpec> =
  'required' extends keyof T ? NonNullable<T['required']> : never

export type JsonObject<T extends ObjectSpec> = 
  ('additionalProperties' extends keyof T ? {} : { [key:string]: AnyJsonValue })
  & Object.Pick<DefinedProperties<T>, RequiredKeys<T>>
  & Omit<Partial<DefinedProperties<T>>, RequiredKeys<T>>
  & {[P in RequiredUnknownKeys<T>]: AnyJson}

export type JSONTypeName = 'null' |'string' |'number' |'boolean' |'object' |'array'

export type JSONTypeOf<T extends JSONTypeName, ObjectType extends ObjectSpec> = {
  '1': {
    'null': null
    'string': string
    'number': number
    'boolean': boolean
    'object': {} extends MinimalObjectSpec<ObjectType> ? AnyJsonObject: JsonObject<MinimalObjectSpec<ObjectType>>
    'array': 'items' extends keyof ObjectType ? ObjectType['items'] : AnyJsonArray
  }[T]
}['1']
