import { AnyJson, AnyJsonArray } from "./json";

type IndexesOf<T extends any[]> = Exclude<keyof T, keyof any[]>
type BoxedTupleTypes<T extends any[]> =
  { [P in keyof T]: [T[P]] }[IndexesOf<T>]
export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type UnboxIntersection<T> = T extends { 0: infer U } ? U : never;
type Intersect<T extends any[]> = CleanJson<UnboxIntersection<UnionToIntersection<BoxedTupleTypes<T>>>>
type Union<T extends AnyJson> = {[P in keyof T]: T[P]}[Exclude<keyof T, keyof AnyJson>]
// type Q = Y<'a', never, 'b'>
// type X = ['a', 1, 'b'] extends Y<infer A, infer N, infer B> ? [A, N, B] : 'nope'

type ExcludeIntersections<T extends Super, Super extends AnyJson> = Exclude<keyof T, keyof Super> extends never ? T : never

export type CleanJson<T> = T extends string ? ExcludeIntersections<T, string>
  : T extends number ? ExcludeIntersections<T, number>
  : T extends boolean ? ExcludeIntersections<T, boolean>
  : T extends null ? ExcludeIntersections<T, null>
  : T extends AnyJsonArray ? ExcludeIntersections<T, AnyJsonArray>
  : T extends AnyJson ? T
  : never
