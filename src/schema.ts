import { AnyJsonArray, AnyJson } from './json'
import { Keyword, JsonTypeName, Keywords, TypeOf } from './keywords'
import { IntersectItems } from './util'

type SchemaInput = Schema<any> | JsonTypeName | JsonTypeName[]

type SchemaKeyword<S extends SchemaInput> =
  S extends Schema<infer K> ? K
  : S extends JsonTypeName ? { type: S }
  : S extends JsonTypeName[] ? { type: S[number]}
  : never

type SchemaKeywordsArray<Schemas extends SchemaInput[]> =
  {[I in keyof Schemas]: Schemas[I] extends SchemaInput ? SchemaKeyword<Schemas[I]> : never }

type SchemaKeywords<Schemas extends SchemaInput[]> =
  SchemaKeywordsArray<Schemas>[number]

type Update<K extends Keywords, U extends Keywords> =
  Schema<{ [P in keyof (K & U)]: (K & U)[P] }>

interface Schema<K extends Keywords> {
  _T: TypeOf<K>
  _K: K
  
  const<Const extends AnyJson>(c: Const): Update<K, Keyword.Const<Const>>

  enum<Enum extends AnyJsonArray>(...items: Enum)
    : Update<K, Keyword.Enum<Enum[number]>>

  properties<Properties extends {[key: string]: SchemaInput}>(props: Properties)
    : Update<K, Keyword.Properties<{ [P in keyof Properties]: SchemaKeyword<Properties[P]> }>>

  required<Keys extends string>(...k: Keys[]): Update<K, Keyword.Required<Keys>>

  additionalProperties<T extends boolean | SchemaInput>(additionalProperties: T)
    : Update<K,
      T extends false ? Keyword.AdditionalPropertiesFalse
      : T extends SchemaInput ? Keyword.AdditionalPropertiesType<SchemaKeyword<T>>
      : { }
    >

  items<Schema extends SchemaInput>(items: Schema)
    : Update<K, Keyword.Items<SchemaKeyword<Schema>>>

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, Keyword.ItemsTuple<SchemaKeywordsArray<Schemas>>>

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, Keyword.Items<SchemaKeywords<Schemas>>>

  oneOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, SchemaKeywords<Schemas>>

  anyOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, SchemaKeywords<Schemas>>

  allOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, IntersectItems<SchemaKeywordsArray<Schemas>>>
}

export function schema(): Schema<{ type: JsonTypeName }> ;
export function schema<T extends JsonTypeName>(...spec: T[]): Schema<{ type: T }> ;
export function schema<K extends Keywords>(spec?: JsonTypeName | JsonTypeName[]): Schema<K>
{ throw 'nope' }
