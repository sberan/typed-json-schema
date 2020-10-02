import { AnyJson, AnyJsonArray } from "./json";

type KeyedObjectKeys<T extends any[]> =
  {[P in keyof T]: Extract<keyof T[P], string>}[number]

type KeyedObjectValue<Key extends string, T extends any[]> =
  {[P in keyof T]: Key extends keyof T[P] ? T[P][Key] : never}[number]

export type KeyedObject<T extends { [key: string]: any }[]> =
  {[P in KeyedObjectKeys<T>]?: KeyedObjectValue<P, T>}

export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type BoxedItem<T> = { box: T }

//intersection of items in a tuple which allows for items to be union types
export type IntersectItems<T extends any[]> =
  UnionToIntersection<{
    [P in keyof T]: BoxedItem<T[P]>
  }[number]> extends BoxedItem<infer Item>
    ? Item extends T[number] ? Item : never : never

type ExcludeIntersections<T extends Super, Super extends AnyJson> = Exclude<keyof T, keyof Super> extends never ? T : never

export type CleanJson<T> = T extends string ? ExcludeIntersections<T, string>
  : T extends number ? ExcludeIntersections<T, number>
  : T extends boolean ? ExcludeIntersections<T, boolean>
  : T extends null ? ExcludeIntersections<T, null>
  : T extends AnyJsonArray ? ExcludeIntersections<T, AnyJsonArray>
  : T extends AnyJson ? T
  : never

export type Default<T, U> = NonNullable<T> extends never ? U : T

export type OmitUndefined<T> = Omit<T, {[P in keyof T]: T[P] extends undefined ? P : never }[keyof T]>
