import { Object } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonValue = AnyJson | undefined
export type AnyJsonObject = {[key: string]: AnyJsonValue}
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

interface ObjectSpec {
  properties?: {[key:string] : AnyJson}
  required?: string
}

type MinimalObjectSpec<T extends ObjectSpec> = {'1': {[P in 
  ('properties' extends keyof T ? {} extends T['properties'] ? never : 'properties' : never)
  | ('required' extends keyof T ? (T['required'] extends never ? never : 'required') : never)
]: T[P]}}['1']

type DefinedProperties<T extends ObjectSpec> =
  'properties' extends keyof T ? NonNullable<T['properties']> : {}

type RequiredUnknownKeys<T extends ObjectSpec> =
  Exclude<RequiredKeys<T>, keyof DefinedProperties<T>>

type RequiredKeys<T extends ObjectSpec> =
  'required' extends keyof T ? NonNullable<T['required']> : never

export type JsonObject<T extends ObjectSpec> = 
  { [key:string]: AnyJsonValue }
  & Object.Pick<DefinedProperties<T>, RequiredKeys<T>>
  & Omit<Partial<DefinedProperties<T>>, RequiredKeys<T>>
  & {[P in RequiredUnknownKeys<T>]: AnyJson}

export type JSONTypes<ObjectType extends ObjectSpec> = {
  'null': null
  'string': string
  'number': number
  'boolean': boolean
  'object': {} extends MinimalObjectSpec<ObjectType> ? AnyJsonObject: JsonObject<MinimalObjectSpec<ObjectType>>
  'array': AnyJsonArray
}

interface Keywords {
  type: keyof JSONTypes<{}>
  properties: {[key: string]: Keywords }
  required: string
}

type TypeOf<K extends Keywords> = Keywords extends K ? AnyJson : JSONTypes<{
  properties: {[P in keyof K['properties']]: TypeOf<K['properties'][P]>}
  required: K['required']
}>[K['type']]

interface Schema<K extends Keywords> {
  _T: TypeOf<K>

  properties<Properties extends {[key: string]: Schema<any>}>(props: Properties)
    : Schema<K & { properties: {[P in keyof Properties]: Properties[P] extends Schema<infer T> ? T : never}}>

  required<Keys extends string>(k: Keys[]): Schema<Object.Overwrite<K, {required: Keys}>>
}

export function schema(): Schema<Keywords> ;
export function schema<T extends Keywords['type']>(spec: T): Schema<{type: T; properties: {}, required: never}> ;
export function schema<T extends Keywords['type']>(spec: T[]): Schema<{type: T; properties: {}, required: never}> ;
export function schema<K extends Keywords>(spec?: Keywords['type'] | Keywords['type'][]): Schema<K>
{ throw 'nope' }
