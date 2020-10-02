import { AnyJsonArray, AnyJson } from './json'
import { 
  AdditionalPropertiesKeywordFalse,
  AdditionalPropertiesKeywordType,
  ConstKeyword,
  EnumKeyword,
  ItemsKeyword,
  ItemsTupleKeyword,
  JsonTypeName,
  Keywords,
  PropertiesKeyword,
  RequiredKeyword,
  TypeOf
} from './intersect-keywords'
import { IntersectItems } from './util'

type SchemaInput = Schema<any> | JsonTypeName | JsonTypeName[]
type SchemaKeyword<S extends SchemaInput> = S extends Schema<infer K>
  ? K
  : S extends JsonTypeName
    ? { type: S }
    : S extends JsonTypeName[]
      ? { type: S[number]}
      : never

type Update<K extends Keywords, U extends Keywords> = Schema<{ [P in keyof (K & U)]: (K & U)[P] }>
type SchemaKeywordsArray<Schemas extends SchemaInput[]> = {[I in keyof Schemas]: Schemas[I] extends SchemaInput ? SchemaKeyword<Schemas[I]> : never }
type SchemaKeywords<Schemas extends SchemaInput[]> = SchemaKeywordsArray<Schemas>[number]

interface Schema<K extends Keywords> {
  _T: TypeOf<K>
  _K: K
  
  const<Const extends AnyJson>(c: Const): Update<K, ConstKeyword<Const>>

  enum<Enum extends AnyJsonArray>(...items: Enum): Update<K, EnumKeyword<Enum[number]>>

  properties<Properties extends {[key: string]: SchemaInput}>(props: Properties)
    : Update<K, PropertiesKeyword<{ [P in keyof Properties]: SchemaKeyword<Properties[P]> }>>

  required<Keys extends string>(...k: Keys[]): Update<K, RequiredKeyword<Keys>>

  additionalProperties<T extends boolean | SchemaInput>(additionalProperties: T)
    : Update<K, T extends false ? AdditionalPropertiesKeywordFalse : T extends SchemaInput ? AdditionalPropertiesKeywordType<SchemaKeyword<T>> : { }>

  items<Schema extends SchemaInput>(items: Schema)
  : Update<K, ItemsKeyword<SchemaKeyword<Schema>>>

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, ItemsTupleKeyword<SchemaKeywordsArray<Schemas>>>

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, ItemsKeyword<SchemaKeywords<Schemas>>>

  oneOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, SchemaKeywords<Schemas>>

  anyOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, {}>

  allOf<Schemas extends SchemaInput[]>(...items: Schemas)
  : Update<K, IntersectItems<{[P in keyof SchemaKeywordsArray<Schemas>]: SchemaKeywordsArray<Schemas>[P] }>>
}

export function schema(): Schema<{ type: JsonTypeName }> ;
export function schema<T extends JsonTypeName>(...spec: T[]): Schema<{ type: T }> ;
export function schema<K extends Keywords>(spec?: JsonTypeName | JsonTypeName[]): Schema<K>
{ throw 'nope' }
