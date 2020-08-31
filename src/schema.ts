import { Any, Object, Union } from 'ts-toolbelt'
import { JSONTypeName, JSONTypeOf, AnyJsonArray, AnyJson } from './json'

interface Keywords {
  type: JSONTypeName
  const: { value: AnyJson }
  enum: { value: AnyJson }
  properties: {[key: string]: Keywords }
  required: string
  additionalProperties: boolean | Keywords
  items: Keywords[]
  oneOf: Keywords[]
}

type InitKeywords<T extends Partial<Keywords> = {} > = Object.Overwrite<{
  type: JSONTypeName
  const: never
  enum: never
  properties: {}
  required: never
  additionalProperties: never
  items: never
  oneOf: never
}, T>

type IntersectValues<V extends {value: AnyJson }> = Union.IntersectOf<V> extends { value: AnyJson} ? { value: Union.IntersectOf<V>['value'] } : never

type PropertyKeys<K extends Keywords[]> = {[P in keyof K]: K[P] extends Keywords ? Extract<keyof K[P]['properties'], string> : never}[number]
type PropertyValue<K extends Keywords[], Prop extends string> = {[P in keyof K]: K[P] extends Keywords ? Prop extends keyof K[P]['properties']  ? K[P]['properties'][Prop] : never : never}[number]

type CombineKeywords<K extends Keywords[]> = {
  type: Exclude<JSONTypeName, {[P in keyof K]: K[P] extends Keywords ? Exclude<JSONTypeName, K[P]['type']> : never }[number]>
  const: K[number]['const'] extends never ? never : IntersectValues<K[number]['const']>
  enum: K[number]['enum'] extends never ? never : IntersectValues<K[number]['enum']>
  properties: {[P in PropertyKeys<K>]: PropertyValue<K, P>}
  required: K[1]['required']
  additionalProperties: K[1]['additionalProperties']
  items: K[1]['items']
  oneOf: K[1]['oneOf']
}

type X = CombineKeywords<[InitKeywords, InitKeywords<{ properties: { a : InitKeywords<{ type: 'number' }>}}>, InitKeywords<{ properties: { b : InitKeywords<{ type: 'number' }>}}>]>

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
      : K['enum']['value']
    : K['const']['value']

type TypeOf<K extends Keywords> = SpecificTypeOf<K, JSONTypeOf<{
  type: K['type']
  properties: PropertiesTypeOf<K>
  required: K['required']
  additionalProperties: AdditionalPropertiesTypeOf<K>
  items: ItemsTypeOf<K>
}>>

type FirstKeywordsAsArray<T extends Keywords[]> = T extends [Keywords] ? T[0][] : T

type KeywordsFromSchemas<Schemas extends Schema<any>[]> = {[P in keyof Schemas]: Schemas[P] extends Schema<infer T> ? T extends Keywords ? T : never : never}

type OneOfKeywords<Parent extends Keywords, K extends Keywords[]> = {[P in keyof K]: K[P] extends Keywords ? TypeOf<CombineKeywords<[Parent, K[P]]>> : never}[number]

interface Schema<K extends Keywords> {
  _T: K['oneOf'] extends never ? TypeOf<K> : OneOfKeywords<K, K['oneOf']>

  const<Const extends AnyJson>(c: Const): Schema<Object.Overwrite<K, { const: { value: Const } }>>

  enum<Enum extends AnyJsonArray>(...items: Enum): Schema<Object.Overwrite<K, { enum: { value: Enum[number] } }>>

  properties<Properties extends {[key: string]: Schema<any>}>(props: Properties)
    : Schema<Object.Overwrite<K, { properties: {[P in keyof Properties]: Properties[P] extends Schema<infer T> ? T : never}}>>

  required<Keys extends string>(k: Keys[]): Schema<Object.Overwrite<K, {required: Keys}>>

  additionalProperties<T extends boolean | Schema<any>>(additionalProperties: T)
    : Schema<Object.Overwrite<K, {additionalProperties: T extends Schema<infer I> ? I : T extends boolean ? T : never}>>

  items<Schemas extends Schema<any>[]>(...items: Schemas)
    : Schema<Object.Overwrite<K, {items: FirstKeywordsAsArray<KeywordsFromSchemas<Schemas>>}>>

  oneOf<Schemas extends Schema<any>[]>(...items: Schemas)
    : Schema<Object.Overwrite<K, { oneOf: KeywordsFromSchemas<Schemas>}>>
}

export function schema(): Schema<InitKeywords> ;
export function schema<T extends Keywords['type']>(spec: T): Schema<InitKeywords<{ type: T }>> ;
export function schema<T extends Keywords['type']>(spec: T[]): Schema<InitKeywords<{ type: T }>> ;
export function schema<K extends Keywords>(spec?: Keywords['type'] | Keywords['type'][]): Schema<K>
{ throw 'nope' }
