import { AnyJson } from "./json"
import { JSONTypeName } from "./json-type-of"
import { Default, UnionToIntersection } from './util'

export type Keywords = {
  type?: JSONTypeName
  const?: AnyJson 
  enum?: AnyJson
  required?: string
  items?: Keywords | Keywords[]
  properties?:  { [key: string]: Keywords } 
  additionalProperties?: boolean | Keywords
}

type Keyword<Key extends keyof Keywords> = {[P in Key]: NonNullable<Keywords[Key]>}

type PopulatedKey<Ks extends Keywords, Key extends keyof Keywords> =
  Ks extends Keyword<Key> ? Key : never

type PopulatedValue<Ks extends Keywords, Key extends keyof Keywords> =
  Ks extends Keyword<Key> ? NonNullable<Ks[Key]> : never

type PopulatedKeyword<Ks extends Keywords, Key extends keyof Keywords> =
  Ks extends Keyword<Key> ? {[P in Key]: NonNullable<Ks[P]>} : never

type IntersectValue<Ks extends Keywords, Key extends keyof Keywords> =
  UnionToIntersection<PopulatedKeyword<Ks, Key>> extends Keyword<Key>
    ? UnionToIntersection<PopulatedKeyword<Ks, Key>>[Key]
    : never

type IntersectKeyword<Ks extends Keywords, Key extends keyof Keywords> = {
  [P in PopulatedKey<Ks, Key>]: IntersectValue<Ks, Key>
}

type UnionValues<Ks extends Keywords, Key extends keyof Keywords> = {
  [K in PopulatedKey<Ks, Key>]: PopulatedValue<Ks, Key>
}

type AllKeywordValues<Ks extends Keywords> =
  AllKeywords<Ks>['calc'] extends Keywords ? {[P in keyof AllKeywords<Ks>['calc']]: AllKeywords<Ks>['calc'][P] }: {}

type AllKeywordTupleValues<Ks extends Keywords[]> = {[I in keyof Ks]: AllKeywordValues<Ks[I]>}

type AllItems<Ks extends Keywords> = {
  [P in PopulatedKey<Ks, 'items'>]:
    PopulatedValue<Ks, 'items'> extends Keywords ? AllKeywordValues<PopulatedValue<Ks, 'items'>>
    : PopulatedValue<Ks, 'items'> extends Keywords[] ? AllKeywordTupleValues<PopulatedValue<Ks, 'items'>>
    : never
}

type AllPropertyKeys<Ks extends Keywords> =
  Ks extends PopulatedKeyword<Ks, 'properties'>
    ? Extract<keyof Ks['properties'], string>
    : never

type PopulatedPropertyValue<Key extends string, Value extends Keywords> = {
  properties: { [P in Key]: Value }
}

type AllPropertyValues<Ks extends Keywords, Key extends string> =
  Ks extends PopulatedPropertyValue<Key, infer Value> ? Value : never

type AllProperties<Ks extends Keywords> = {
  [P in PopulatedKey<Ks, 'properties'>]: {
    [PK in AllPropertyKeys<Ks>]: {
      [P in keyof AllKeywords<AllPropertyValues<Ks, PK>>['calc']]: AllKeywords<AllPropertyValues<Ks, PK>>['calc'][P]
    }
  }
}

type AdditionalPropertiesValue<Ks extends boolean | Keywords> =
  false extends Extract<Ks, false>
    ? false
    : keyof Default<Exclude<Ks, boolean>, {}> extends never
      ? true
      : Ks extends Keywords ? AllKeywords<Ks>['calc'] : never


type AllAdditionalProperties<Ks extends Keywords> = {
  [P in PopulatedKey<Ks, 'additionalProperties'>]: 
    AdditionalPropertiesValue<PopulatedValue<Ks, 'additionalProperties'>> extends boolean ? AdditionalPropertiesValue<PopulatedValue<Ks, 'additionalProperties'>>
    : {[P in keyof AdditionalPropertiesValue<PopulatedValue<Ks, 'additionalProperties'>> ]: AdditionalPropertiesValue<PopulatedValue<Ks, 'additionalProperties'>>[P]}
}

type AllKeywords<Ks extends Keywords> = {
  'calc': IntersectKeyword<Ks, 'type'>
    & IntersectKeyword<Ks, 'const'>
    & IntersectKeyword<Ks, 'enum'>
    & UnionValues<Ks, 'required'>
    & AllItems<Ks>
    & AllProperties<Ks>
    & AllAdditionalProperties<Ks>
}

export type AllOf<Ks extends Keywords> = {[P in keyof AllKeywords<Ks>['calc']]: AllKeywords<Ks>['calc'][P]}

export type BothOf<Ks1 extends Keywords, Ks2 extends Keywords> =
  Ks1 extends Keywords
    ? Ks2 extends Keywords
      ? {[P in keyof AllKeywords<Ks1 | Ks2>['calc']]: AllKeywords<Ks1 | Ks2>['calc'][P]}
      : never
    : never

type TypeString = AllOf<{ type:'number' | 'string' } | { type: 'string' } | { const: 42 } | {}>
type TypeNever = AllOf<{ type:'number' } | { type: 'string' } >
type TypeNumber = AllOf<{ type:'number' | 'string' } | { type: 'number' }>
type Const42 = AllOf<{ const: 42 } | {}>
type ConstNever = AllOf<{ const: 42 } | { const: { a: 52 } } | {}>
type RequiredABCD = AllOf<{ required: 'a' | 'b' } | { required: 'c' | 'd' } | { }>
type ItemsString = AllOf<{ items: { type: 'string' } } | {} | { items: { type: 'string' | 'number' } }>
type ItemsNever = AllOf<{ items: { type: 'string' } } | {} | { items: { type: 'number' } }>
type AStringBBoleanCNever = AllOf<{type: 'object', properties: { a: { type: 'string' }, c: { type: 'number' }  } } | {} | { properties: { a: { type: 'string' | 'number' }, b: { type: 'boolean' }, c: { type: 'string' } } }>
type AdditionalPropertiesFalse = AllOf<{ additionalProperties: false } | { additionalProperties: { type: 'string' }}>
type AdditionalPropertiesTrue = AllOf<{ } | { additionalProperties: true }>
type AdditionalPropertiesString = AllOf<{ additionalProperties: true } | { additionalProperties: { type: 'string' }}>