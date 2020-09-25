import { AnyJsonArray, AnyJson } from './json'
import { Keywords, TypeOf } from './keywords'

type Overwrite<T, U> = Schema<{[P in (keyof T | keyof U)]: P extends keyof U ? U[P] : P extends keyof T ? T[P] : never }>
type FirstKeywordsAsArray<T extends Keywords[]> = T extends [Keywords] ? T[0] : T
type KeywordsFromSchemas<Schemas extends Schema<any>[]> = {[P in keyof Schemas]: Schemas[P] extends Schema<infer T> ? T extends Keywords ? T : never : never}

interface Schema<K extends Keywords> {
  _T: TypeOf<K>

  const<Const extends AnyJson>(c: Const): Overwrite<K, { const: Const }>

  enum<Enum extends AnyJsonArray>(...items: Enum): Overwrite<K, { enum: { value: Enum[number] } }>

  properties<Properties extends {[key: string]: Schema<any>}>(props: Properties)
    : Overwrite<K, { properties: {[P in keyof Properties]: Properties[P] extends Schema<infer T> ? T : never}}>

  required<Keys extends string>(...k: Keys[]): Overwrite<K, {required: Keys}>

  additionalProperties<T extends boolean | Schema<any>>(additionalProperties: T)
    : Overwrite<K, {additionalProperties: T extends Schema<infer I> ? I : T extends boolean ? T : never}>

  items<Schemas extends Schema<any>[]>(...items: Schemas)
    : Overwrite<K, {items: FirstKeywordsAsArray<KeywordsFromSchemas<Schemas>>}>

  oneOf<Schemas extends Schema<any>[]>(...items: Schemas)
    : Overwrite<K, { oneOf: KeywordsFromSchemas<Schemas>}>
}

export function schema(): Schema<{}> ;
export function schema<T extends Keywords['type']>(...spec: T[]): Schema<{ type: T }> ;
export function schema<K extends Keywords>(spec?: Keywords['type'] | Keywords['type'][]): Schema<K>
{ throw 'nope' }


const x = schema('string').const('a')._T