import { Object } from 'ts-toolbelt'
import { JSONTypeName, AnyJson, JSONTypeOf } from './json'

interface Keywords {
  type: JSONTypeName
  properties: {[key: string]: Keywords }
  required: string
  additionalProperties: false
}

type TypeOf<K extends Keywords> = Keywords extends K ? AnyJson : JSONTypeOf<K['type'], {
  properties: {[P in keyof K['properties']]: TypeOf<K['properties'][P]>}
  required: K['required']
  additionalProperties: K['additionalProperties']
}>

interface Schema<K extends Keywords> {
  _T: TypeOf<K>

  properties<Properties extends {[key: string]: Schema<any>}>(props: Properties)
    : Schema<Object.Overwrite<K, { properties: {[P in keyof Properties]: Properties[P] extends Schema<infer T> ? T : never}}>>

  required<Keys extends string>(k: Keys[]): Schema<Object.Overwrite<K, {required: Keys}>>

  additionalProperties<T extends boolean>(additionalProperties: T): T extends false ? Schema<Object.Overwrite<K, {additionalProperties: T}>> : K
}

type InitialKeywords<T extends JSONTypeName> = { type: T; properties: {}, required: never, additionalProperties: never }
export function schema(): Schema<Keywords> ;
export function schema<T extends Keywords['type']>(spec: T): Schema<InitialKeywords<T>> ;
export function schema<T extends Keywords['type']>(spec: T[]): Schema<InitialKeywords<T>> ;
export function schema<K extends Keywords>(spec?: Keywords['type'] | Keywords['type'][]): Schema<K>
{ throw 'nope' }
