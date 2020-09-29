import { AnyJsonArray, AnyJson } from './json'
import { TypeOf } from './json-type-of'
import { Keywords, AllOf, BothOf } from './keywords'

type Update<K extends Keywords, U extends Keywords> = {'calc': Schema<BothOf<K, U>>}
type SchemaKeywords<Schemas extends Schema<any>[]> = {[I in keyof Schemas]: Schemas[I] extends Schema<infer Ks> ? Ks : never }
type FirstItem<Ks extends Keywords[]> = Ks extends [Keywords] ? Ks[0] : Ks

interface Schema<K extends Keywords> {
  _T: TypeOf<K>
  _K: K
  
  const<Const extends AnyJson>(c: Const): Update<K, { const: Const }>['calc']

  enum<Enum extends AnyJsonArray>(...items: Enum): Update<K, { enum: Enum[number] }>['calc']

  properties<Properties extends {[key: string]: Schema<any>}>(props: Properties)
    : Update<K, { properties: { [P in keyof Properties]: Properties[P] extends Schema<infer T> ? T : never } }>['calc']

  required<Keys extends string>(...k: Keys[]): Update<K, { required: Keys }>['calc']

  additionalProperties<T extends boolean | Schema<any>>(additionalProperties: T)
    : Update<K, { additionalProperties: T extends Schema<infer I> ? I : T extends boolean ? T : never }>['calc']

  items<Schemas extends Schema<any>[]>(...items: Schemas)
    : Update<K, { items: FirstItem<SchemaKeywords<Schemas>> }>['calc']

  oneOf<Schemas extends Schema<any>[]>(...items: Schemas)
    : Update<K, SchemaKeywords<Schemas>[keyof Schemas]>['calc']

  anyOf<Schemas extends Schema<any>[]>(...items: Schemas)
    : Update<K, {}>['calc']

  allOf<Schemas extends Schema<any>[]>(...items: Schemas)
  : Update<K, {}>['calc']
}

export function schema(): Schema<{}> ;
export function schema<T extends Keywords['type']>(...spec: T[]): Schema<{ type: T }> ;
export function schema<K extends Keywords>(spec?: Keywords['type'] | Keywords['type'][]): Schema<K>
{ throw 'nope' }
