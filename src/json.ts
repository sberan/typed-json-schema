import { Any, Object } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonValue = AnyJson | undefined
export type AnyJsonObject = {[key: string]: AnyJsonValue}
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

export type JSONTypeName = 'null' |'string' |'number' |'boolean' |'object' |'array'

interface JsonSpec {
  type: JSONTypeName
  properties: {[key:string] : AnyJson}
  required: string
  additionalProperties: boolean | { type: AnyJson }
  items: AnyJsonArray
}

interface ObjectSpec {
  properties?: {[key:string] : AnyJson}
  required?: string
  additionalProperties?: boolean | { type: AnyJson }
}

type MinimalObjectSpec<T extends ObjectSpec> = {'1': {[P in 
  ('properties' extends keyof T ? {} extends T['properties'] ? never : 'properties' : never)
  | ('required' extends keyof T ? (T['required'] extends never ? never : 'required') : never)
  | ('additionalProperties' extends keyof T ? (true extends T['additionalProperties'] ? never : 'additionalProperties') : never)
]: T[P]}}['1']

type DefinedProperties<T extends ObjectSpec> =
  'properties' extends keyof T ? NonNullable<T['properties']> : {}

type RequiredUnknownKeys<T extends ObjectSpec> =
  Exclude<RequiredKeys<T>, keyof DefinedProperties<T>>

type RequiredKeys<T extends ObjectSpec> =
  'required' extends keyof T ? NonNullable<T['required']> : never

export type JsonObject<T extends ObjectSpec> = 
  ('additionalProperties' extends keyof T 
    ? false extends T['additionalProperties'] 
      ? {} 
      : 'type' extends keyof T['additionalProperties']
        ? {[key:string]: T['additionalProperties']['type']}
        : {[key: string]: AnyJsonValue}
    : {[key: string]: AnyJsonValue}
  )
  & Object.Pick<DefinedProperties<T>, RequiredKeys<T>>
  & Omit<Partial<DefinedProperties<T>>, RequiredKeys<T>>
  & {[P in RequiredUnknownKeys<T>]: AnyJson}

type AnyJsonDefault<T> = AnyJson extends T ? AnyJson : T

export type JSONTypeOf<ObjectType extends JsonSpec> = AnyJsonDefault<{
  'null': null
  'string': string
  'number': number
  'boolean': boolean
  'object': {} extends MinimalObjectSpec<ObjectType> ? AnyJsonObject: JsonObject<MinimalObjectSpec<ObjectType>>
  'array': 'items' extends keyof ObjectType ? ObjectType['items'] : AnyJsonArray
}[ObjectType['type']]>
