import { AnyJsonArray, AnyJson } from './json'
import { Keyword, JsonTypeName, Keywords, TypeOf, Invert } from './keywords'
import { IntersectItems } from './util'

type SchemaInput = Schema<Keywords> | JsonTypeName

type SchemaKeyword<S extends SchemaInput> =
  S extends Schema<infer K> ? K
  : S extends JsonTypeName ? { type: S }
  : never

type SchemaKeywordsArray<Schemas extends SchemaInput[]> =
  {[I in keyof Schemas]: Schemas[I] extends SchemaInput ? SchemaKeyword<Schemas[I]> : never }

type SchemaKeywords<Schemas extends SchemaInput[]> =
  SchemaKeywordsArray<Schemas>[number]

type ExcludeObject<K1, K2> = {
  'calc': {[P in keyof K1]: P extends keyof K2 ? Exclude<K1[P], K2[P]> : K1[P]}
}

type SchemaUnion<K extends Keywords, Schemas extends SchemaInput[]> =
  SchemaKeywords<Schemas> extends infer ItemKeyword
    ? ItemKeyword & K
    : never

type SchemaDifference<K extends Keywords, Schemas extends Keywords[]> =
  {[I in keyof Schemas]: ExcludeObject<Schemas[I] & K, {[O in keyof Schemas]: O extends I ? never : Schemas[O]}[number]>['calc'] }
  
type SchemaIntersection<Schemas extends SchemaInput[]> =
  IntersectItems<SchemaKeywordsArray<Schemas>>

type Update<K extends Keywords, U extends Keywords> = {
  'calc': Schema<{ [P in keyof (K & U)]: (K & U)[P] }>
}

export interface Schema<K extends Keywords> {
  _T: TypeOf<K>
  _K: K

  toJSON(): AnyJson
  
  const<Const extends AnyJson>(c: Const)
    : Update<K, Keyword.Const<Const>>['calc']

  enum<Enum extends AnyJsonArray>(...items: Enum)
    : Update<K, Keyword.Enum<Enum[number]>>['calc']

  properties<Properties extends {[key: string]: SchemaInput}>(props: Properties)
    : Update<K, Keyword.Properties<{ [P in keyof Properties]: SchemaKeyword<Properties[P]> }>>['calc']

  required<Keys extends string>(...k: Keys[])
    : Update<K, Keyword.Required<Keys>>['calc']

  additionalProperties<T extends boolean | SchemaInput>(additionalProperties: T)
    : Update<K,
      T extends false ? Keyword.AdditionalPropertiesFalse
      : T extends SchemaInput ? Keyword.AdditionalPropertiesType<SchemaKeyword<T>>
      : { }
    >['calc']

  items<Schema extends SchemaInput>(items: Schema)
    : Update<K, Keyword.Items<SchemaKeyword<Schema>>>['calc']

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, Keyword.ItemsTuple<SchemaKeywordsArray<Schemas>>>['calc']

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, Keyword.Items<SchemaKeywords<Schemas>>>['calc']

  oneOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Schema<SchemaDifference<K, SchemaKeywordsArray<Schemas>>[number]>

  anyOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Schema<SchemaUnion<K, Schemas>>

  allOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, SchemaIntersection<Schemas>>['calc']
  
  not<Input extends SchemaInput>(not: Input) : Schema<Invert<SchemaKeyword<Input>>>
}

export function schema(): Schema<{ }> ;
export function schema<T extends JsonTypeName>(...spec: T[]): Schema<{ type: T }> ;
export function schema<K extends Keywords>(spec?: JsonTypeName | JsonTypeName[]): Schema<K>
{ throw 'nope' }

export type schema<T extends Schema<any>> = T['_T']