export type JSONPrimitive = string | number | boolean | null
export interface JSONArray extends Array<AnyJSON> {}
export interface JSONObject { [key: string]: AnyJSON }
export type AnyJSON = JSONPrimitive | JSONArray | JSONObject

export function callableInstance <T extends { [P in K]: Function }, K extends keyof T> (obj: T, key: K): T & T[K] {
  const
    boundMethod: T[K] = (obj[key] as Function).bind(obj),
    merged = Object.assign(boundMethod, obj)

  ;(boundMethod as any).__proto__ = (obj as any).__proto__
  return merged
}
