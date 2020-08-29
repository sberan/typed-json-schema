import { Object } from 'ts-toolbelt'
import { JSONTypeName, AnyJson, JSONTypeOf, AnyJsonArray } from './json'

interface Keywords {
  type: JSONTypeName
  properties: {[key: string]: Keywords }
  required: string
  additionalProperties: boolean
  items: Keywords
}

type InitialKeywords<T extends JSONTypeName = JSONTypeName> = {
  type: T
  properties: {}
  required: never
  additionalProperties: never
  items: never
}

type TypeOf<K extends Keywords> = JSONTypeOf<{
  type: K['type']
  properties: {[P in keyof K['properties']]: TypeOf<K['properties'][P]>}
  required: K['required']
  additionalProperties: K['additionalProperties']
  items: K['items'] extends never ? AnyJsonArray : TypeOf<K['items']>[]
}>

interface Schema<K extends Keywords> {
  _T: TypeOf<K>

  properties<Properties extends {[key: string]: Schema<any>}>(props: Properties)
    : Schema<Object.Overwrite<K, { properties: {[P in keyof Properties]: Properties[P] extends Schema<infer T> ? T : never}}>>

  required<Keys extends string>(k: Keys[]): Schema<Object.Overwrite<K, {required: Keys}>>

  additionalProperties<T extends boolean>(additionalProperties: T): Schema<Object.Overwrite<K, {additionalProperties: T}>>

  items<Items extends Keywords>(items: Schema<Items>): Schema<Object.Overwrite<K, {items: Items}>>
}

export function schema(): Schema<InitialKeywords> ;
export function schema<T extends Keywords['type']>(spec: T): Schema<InitialKeywords<T>> ;
export function schema<T extends Keywords['type']>(spec: T[]): Schema<InitialKeywords<T>> ;
export function schema<K extends Keywords>(spec?: Keywords['type'] | Keywords['type'][]): Schema<K>
{ throw 'nope' }
