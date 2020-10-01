import { AnyJsonArray, AnyJson } from './json'
import { 
  AllOf,
  AnyOfKeyword,
  ConstKeyword,
  EnumKeyword,
  ItemsKeyword,
  JSONTypeName,
  Keywords,
  PropertiesKeyword,
  RequiredKeyword,
  TypeOf
} from './intersect-keywords'

type SchemaInput = Schema<any> | JSONTypeName | JSONTypeName[]
type SchemaKeyword<S extends SchemaInput> = S extends Schema<infer K>
  ? K
  : S extends JSONTypeName
    ? { type: S }
    : S extends JSONTypeName[]
      ? { type: S[number]}
      : never

type Update<K extends Keywords, U extends Keywords> = {'calc': Schema<{[P in keyof (K & U)]: (K & U)[P] }>}
type SchemaKeywordsArray<Schemas extends SchemaInput[]> = {[I in keyof Schemas]: Schemas[I] extends SchemaInput ? SchemaKeyword<Schemas[I]> : never }
type SchemaKeywords<Schemas extends SchemaInput[]> = SchemaKeywordsArray<Schemas>[number]

interface Schema<K extends Keywords> {
  _T: TypeOf<K>
  _K: K
  
  const<Const extends AnyJson>(c: Const): Update<K, ConstKeyword<Const>>['calc']

  enum<Enum extends AnyJsonArray>(...items: Enum): Update<K, EnumKeyword<Enum[number]>>['calc']

  properties<Properties extends {[key: string]: SchemaInput}>(props: Properties)
    : Update<K, PropertiesKeyword<{ [P in keyof Properties]: SchemaKeyword<Properties[P]> }>>['calc']

  required<Keys extends string>(...k: Keys[]): Update<K, RequiredKeyword<Keys>>['calc']

  additionalProperties<T extends boolean | SchemaInput>(additionalProperties: T)
    : Update<K, { additionalProperties: T extends SchemaInput ? SchemaKeyword<T> : T extends boolean ? T : never }>['calc']

  items<Schema extends SchemaInput>(items: Schema)
  : Update<K, ItemsKeyword<SchemaKeyword<Schema>>>['calc']

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, ItemsKeyword<SchemaKeywords<Schemas>>>['calc']

  oneOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, SchemaKeywords<Schemas>>['calc']

  anyOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, {}>['calc']

  allOf<Schemas extends SchemaInput[]>(...items: Schemas)
  : Update<K, AllOf<{[P in keyof SchemaKeywordsArray<Schemas>]: AnyOfKeyword<SchemaKeywordsArray<Schemas>[P]> }[number]>>['calc']
}

export function schema(): Schema<{ type: JSONTypeName }> ;
export function schema<T extends JSONTypeName>(...spec: T[]): Schema<{ type: T }> ;
export function schema<K extends Keywords>(spec?: JSONTypeName | JSONTypeName[]): Schema<K>
{ throw 'nope' }
