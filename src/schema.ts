import { Object } from 'ts-toolbelt'
import { JSONTypeName, JSONTypeOf, AnyJsonArray, AnyJson } from './json'

interface Keywords {
  type: JSONTypeName
  const: AnyJson
  enum: AnyJson[]
  properties: {[key: string]: Keywords }
  required: string
  additionalProperties: boolean | Keywords
  items: Keywords[]
}

type InitialKeywords<T extends JSONTypeName = JSONTypeName> = {
  type: T
  const: never
  enum: never
  properties: {}
  required: never
  additionalProperties: never
  items: never
}

type EnsureJsonArray<T> = T extends AnyJsonArray ? T : AnyJsonArray
type KeywordsArrayTypeOf<K extends Keywords[]> = {[P in keyof K]: K[P] extends Keywords ? TypeOf<K[P]> : AnyJsonArray}

type PropertiesTypeOf<K extends Keywords> = {'1': {[P in keyof K['properties']]: TypeOf<K['properties'][P]>}}['1']
type ItemsTypeOf<K extends Keywords> = K['items'] extends never ? AnyJsonArray : EnsureJsonArray<KeywordsArrayTypeOf<K['items']>>
type AdditionalPropertiesTypeOf<K extends Keywords> =
  K['additionalProperties'] extends boolean 
    ? K['additionalProperties'] extends never
      ? true
      : K['additionalProperties']
    : K['additionalProperties'] extends Keywords
      ? { type: TypeOf<K['additionalProperties']>}
      : true

type SpecificTypeOf<K extends Keywords, Default extends AnyJson> = 
  K['const'] extends never
    ? K['enum'] extends never
      ? Default
      : (K['enum'] extends Array<infer T> ? T extends AnyJson ? T : never : never)
    : K['const']

type TypeOf<K extends Keywords> = SpecificTypeOf<K, JSONTypeOf<{
  type: K['type']
  properties: PropertiesTypeOf<K>
  required: K['required']
  additionalProperties: AdditionalPropertiesTypeOf<K>
  items: ItemsTypeOf<K>
}>>

type FirstKeywordsAsArray<T extends Keywords[]> = T extends [Keywords] ? T[0][] : T

interface Schema<K extends Keywords> {
  _T: TypeOf<K>

  const<Const extends AnyJson>(c: Const): Schema<Object.Overwrite<K, { const: Const }>>

  enum<Enum extends AnyJsonArray>(...items: Enum): Schema<Object.Overwrite<K, { enum: Enum }>>

  properties<Properties extends {[key: string]: Schema<any>}>(props: Properties)
    : Schema<Object.Overwrite<K, { properties: {[P in keyof Properties]: Properties[P] extends Schema<infer T> ? T : never}}>>

  required<Keys extends string>(k: Keys[]): Schema<Object.Overwrite<K, {required: Keys}>>

  additionalProperties<T extends boolean | Schema<any>>(additionalProperties: T)
    : Schema<Object.Overwrite<K, {additionalProperties: T extends Schema<infer I> ? I : T extends boolean ? T : never}>>

  items<Schemas extends Schema<any>[]>(...items: Schemas)
    : Schema<Object.Overwrite<K, {items: FirstKeywordsAsArray<{[P in keyof Schemas]: Schemas[P] extends Schema<infer T> ? T : never}>}>>
}

export function schema(): Schema<InitialKeywords> ;
export function schema<T extends Keywords['type']>(spec: T): Schema<InitialKeywords<T>> ;
export function schema<T extends Keywords['type']>(spec: T[]): Schema<InitialKeywords<T>> ;
export function schema<K extends Keywords>(spec?: Keywords['type'] | Keywords['type'][]): Schema<K>
{ throw 'nope' }
