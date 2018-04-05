export type JSONPrimitive = string | number | boolean | null
export interface JSONArray extends Array<AnyJSON> {} // tslint:disable-line:no-empty-interface
export interface JSONObject { [key: string]: AnyJSON }
export type AnyJSON = JSONPrimitive | JSONArray | JSONObject

export function copyJson<T> (json: T) {
  return JSON.parse(JSON.stringify(json)) as T
}

// tslint:disable-next-line:ban-types
export function callableInstance <T extends { [P in K]: Function }, K extends keyof T> (obj: T, key: K): T & T[K] {
  const
    boundMethod: T[K] = (obj[key] as Function).bind(obj), // tslint:disable-line:ban-types
    merged = Object.assign(boundMethod, obj)

  // tslint:disable-next-line:align
  ; (boundMethod as any).__proto__ = (obj as any).__proto__
  return merged
}

export type Diff<T extends string, U extends string>
    = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
export type Overwrite<T, U> = { [P in Diff<keyof T, keyof U>]: T[P] } & U
export type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] }
