export type AnyJSONPrimitive = string | number | boolean | null
export interface AnyJSONArray extends Array<AnyJSON> {} // tslint:disable-line:no-empty-interface
export type AnyJSONObject = 1 extends 2 ? never : {[key:string]: AnyJSON}
export type AnyJSON = AnyJSONPrimitive | Array<AnyJSON> | AnyJSONObject


interface JSONObjectType {
  properties?: {[key:string] : AnyJSON}
}

//TODO can we make this just JSONObject<{}> for consumers?
export type JSONObject<T extends JSONObjectType> = {
  [key:string]: AnyJSON
} & ('properties' extends keyof T ? T['properties'] : {})

    
export type JSONTypes<ObjectType extends JSONObjectType> = {
  'null': null
  'string': string
  'number': number
  'boolean': boolean
  'object': JSONObject<ObjectType>
  'array': AnyJSONArray
}

