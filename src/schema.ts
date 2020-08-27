import { Object } from 'ts-toolbelt'
type OmitKeyIf<T extends object, P extends keyof T, TestEmpty> = TestEmpty extends T[P] ? Object.Omit<T, P> : T


export type JSONPrimitive = string | number | boolean | null
export interface JSONArray extends Array<AnyJSON> {} // tslint:disable-line:no-empty-interface
export type AnyJSON = JSONPrimitive | JSONArray | JSONObject<{}>

interface JSONObjectType {
  properties?: {[key:string] : AnyJSON}
}


export type JSONObject<T extends JSONObjectType> = {
  [key:string]: AnyJSON
}

type JSONTypes<ObjectType> = {
  'null': null
  'string': string
  'number': number
  'boolean': boolean
  'object': JSONObject<ObjectType>
  'array': JSONArray
}

interface Keywords {
  type: keyof JSONTypes<{}>
  properties: {[key: string]: Keywords }
}

type TypeOf<K extends Keywords> = Keywords extends K ? AnyJSON : JSONTypes<OmitKeyIf<{ properties: {[P in keyof K['properties']]: TypeOf<K['properties'][P]>}}, 'properties', {}>>[K['type']]

interface Schema<K extends Keywords> {
  _T: TypeOf<K>

  properties<Properties extends {[key: string]: Schema<any>}>(props: Properties)
    : Schema<K & { properties: {[P in keyof Properties]: Properties[P] extends Schema<infer T> ? T : never}}>
}

export function schema(): Schema<Keywords> ;
export function schema<T extends Keywords['type']>(spec: T): Schema<{type: T; properties: {}}> ;
export function schema<T extends Keywords['type']>(spec: T[]): Schema<{type: T; properties: {}}> ;
export function schema(spec?: Keywords['type'] | Keywords['type'][]): Schema<Keywords>
{ throw 'nope' }
