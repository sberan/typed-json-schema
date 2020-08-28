import { Object } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonObject = {[key: string]: AnyJson }
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

interface JSONObjectType {
  properties?: {[key:string] : AnyJson}
}

//TODO can we make this just JSONObject<{}> for consumers?
export type JsonObject<T extends JSONObjectType> = {
  [key:string]: AnyJson
} & ('properties' extends keyof T ? T['properties'] : {})

export type JSONTypes<ObjectType extends JSONObjectType> = {
  'null': null
  'string': string
  'number': number
  'boolean': boolean
  'object': {} extends ObjectType ? AnyJsonObject: JsonObject<ObjectType>
  'array': AnyJsonArray
}

type OmitKeyIf<T extends object, P extends keyof T, TestEmpty> = TestEmpty extends T[P] ? Object.Omit<T, P> : T

interface Keywords {
  type: keyof JSONTypes<{}>
  properties: {[key: string]: Keywords }
}

type TypeOf<K extends Keywords> = Keywords extends K ? AnyJson : JSONTypes<OmitKeyIf<{ properties: {[P in keyof K['properties']]: TypeOf<K['properties'][P]>}}, 'properties', {}>>[K['type']]

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
