import { Object } from 'ts-toolbelt'
import { JSONTypeName, AnyJson, JSONTypeOf } from './json'

interface Keywords {
  type: JSONTypeName
  properties: {[key: string]: Keywords }
  required: string
}

type TypeOf<K extends Keywords> = Keywords extends K ? AnyJson : JSONTypeOf<K['type'], {
  properties: {[P in keyof K['properties']]: TypeOf<K['properties'][P]>}
  required: K['required']
}>

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
