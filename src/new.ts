import { AnyJson } from "./json"
import { JSONTypeName } from "./keywords"
import { CleanJson, UnionToIntersection } from './util'

type Keywords = {
  type?: JSONTypeName
  const?: AnyJson 
  required?: string
  items?: Keywords
  properties?:  {[key: string]: Keywords } 
  additionalProperties?: boolean | Keywords
}

type Keyword<Key extends keyof Keywords> = {[P in Key]: NonNullable<Keywords[Key]>}

type PopulatedKey<Ks extends Keywords, Key extends keyof Keywords> = Ks extends Keyword<Key> ? Key : never

type PopulatedValue<Ks extends Keywords, Key extends keyof Keywords> = Ks extends Keyword<Key> ? Ks[Key] : never

type PopulatedKeyword<Ks extends Keywords, Key extends keyof Keywords> = Ks extends Keyword<Key> ? {[P in Key]: Ks[P]} : never

type IntersectValue<Ks extends Keywords, Key extends keyof Keywords>
  = UnionToIntersection<PopulatedKeyword<Ks, Key>> extends Keyword<Key> ? UnionToIntersection<PopulatedKeyword<Ks, Key>>[Key] : never

type IntersectKeyword<Ks extends Keywords, Key extends keyof Keywords> =
  {[P in PopulatedKey<Ks, Key>]: IntersectValue<Ks, Key> }

type UnionValues<Ks extends Keywords, Key extends keyof Keywords> = {[K in PopulatedKey<Ks, Key>]: PopulatedValue<Ks, Key>}

type AllKeywords<Ks extends Keywords> =
    IntersectKeyword<Ks, 'type'>
  & IntersectKeyword<Ks, 'const'>
  & UnionValues<Ks, 'required'>

type AllOf<Ks extends Keywords> = {[P in keyof AllKeywords<Ks>]: AllKeywords<Ks>[P]}

type TypeString = AllOf<{ type:'number' | 'string' } | { type: 'string' } | { const: 42 } | {}>
type TypeNever = AllOf<{ type:'number' } | { type: 'string' } >
type TypeNumber = AllOf<{ type:'number' | 'string' } | { type: 'number' }>
type Const42 = AllOf<{ const: 42 } | {}>
type ConstNever = AllOf<{ const: 42 } | { const: { a: 52 } } | {}>
type RequiredABCD = AllOf<{ required: 'a' | 'b' } | { required: 'c' | 'd' } | { }>
type ItemsString = AllOf<{ items: { type: 'string' } } | {} | { items: { type: 'string' | 'number' } }>
type ItemsNever = AllOf<{ items: { type: 'string' } } | {} | { items: { type: 'number' } }>