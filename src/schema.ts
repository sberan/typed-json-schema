import { AnyJsonArray, AnyJson } from './json'
import { JSONTypeName, TypeOf } from './json-type-of'
import { Keywords, BothOf, AllOf } from './keywords'

type SchemaInput = Schema<any> | JSONTypeName | JSONTypeName[]
type SchemaKeyword<S extends SchemaInput> = S extends Schema<infer K>
  ? K
  : S extends JSONTypeName
    ? { type: S }
    : S extends JSONTypeName[]
      ? { type: S[number]}
      : never

type Update<K extends Keywords, U extends Keywords> = {'calc': Schema<BothOf<K, U>>}
type SchemaKeywords<Schemas extends SchemaInput[]> = {[I in keyof Schemas]: Schemas[I] extends SchemaInput ? SchemaKeyword<Schemas[I]> : never }

interface Schema<K extends Keywords> {
  _T: TypeOf<K>
  _K: K
  
  const<Const extends AnyJson>(c: Const): Update<K, { const: Const }>['calc']

  enum<Enum extends AnyJsonArray>(...items: Enum): Update<K, { enum: Enum[number] }>['calc']

  properties<Properties extends {[key: string]: SchemaInput}>(props: Properties)
    : Update<K, { properties: { [P in keyof Properties]: SchemaKeyword<Properties[P]> } }>['calc']

  required<Keys extends string>(...k: Keys[]): Update<K, { required: Keys }>['calc']

  additionalProperties<T extends boolean | SchemaInput>(additionalProperties: T)
    : Update<K, { additionalProperties: T extends SchemaInput ? SchemaKeyword<T> : T extends boolean ? T : never }>['calc']

  items<Schema extends SchemaInput>(items: Schema)
  : Update<K, { items: SchemaKeyword<Schema> }>['calc']

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, { items: SchemaKeywords<Schemas> }>['calc']

  oneOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, SchemaKeywords<Schemas>[keyof Schemas]>['calc']

  anyOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, {}>['calc']

  allOf<Schemas extends SchemaInput[]>(...items: Schemas)
  : Update<K, AllOf<SchemaKeywords<Schemas>[number]>>['calc']
}

export function schema(): Schema<{}> ;
export function schema<T extends Keywords['type']>(...spec: T[]): Schema<{ type: T }> ;
export function schema<K extends Keywords>(spec?: Keywords['type'] | Keywords['type'][]): Schema<K>
{ throw 'nope' }
