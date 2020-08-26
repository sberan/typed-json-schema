export type JSONPrimitive = string | number | boolean | null
export interface JSONArray extends Array<AnyJSON> {} // tslint:disable-line:no-empty-interface
export type JSONObject = { [key: string]: AnyJSON | undefined }
export type AnyJSON = JSONPrimitive | JSONArray | JSONObject


interface BasicTypes {
  'null': null
  'string': string
  'number': number
  'boolean': boolean
  'object': JSONObject
  'array': JSONArray
}

interface Keywords {
  type: keyof BasicTypes
}

type TypeOf<K extends Keywords> = Keywords extends K ? AnyJSON : {'1': BasicTypes[K['type']]}['1']

interface Schema<K extends Keywords> {
  _T: TypeOf<K>
}

export function schema(): Schema<Keywords> ;
export function schema<T extends Keywords['type']>(spec: T): Schema<{type: T}> ;
export function schema<T extends Keywords['type']>(spec: T[]): Schema<{type: T}> ;
export function schema(spec?: Keywords['type'] | Keywords['type'][]): Schema<Keywords>
{ throw 'nope' }
