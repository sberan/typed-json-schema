import { AnyJsonArray, AnyJson } from './json'
import { Keyword, JsonTypeName, Keywords, TypeOf } from './keywords'
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

type Update<K extends Keywords, U extends Keywords> = {
  'calc': Schema<{ [P in keyof (K & U)]: (K & U)[P] }>
}

interface Schema<K extends Keywords> {
  _T: TypeOf<K>
  _K: K
  
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
    : Update<K, SchemaKeywords<Schemas>>['calc']

  anyOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Schema<
      SchemaKeywords<Schemas> extends infer ItemKeyword
        ? ItemKeyword & K
        : never
    >

  allOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, IntersectItems<SchemaKeywordsArray<Schemas>>>['calc']
}

export function schema(): Schema<{ }> ;
export function schema<T extends JsonTypeName>(...spec: T[]): Schema<{ type: T }> ;
export function schema<K extends Keywords>(spec?: JsonTypeName | JsonTypeName[]): Schema<K>
{ throw 'nope' }
