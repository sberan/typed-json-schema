import { Object, List, Union, Any, M } from 'ts-toolbelt'

export type AnyJsonObject = M.JSON.Object
export type AnyJsonArray = M.JSON.Array
type JsonArray<R extends JsonRestriction> = []

type JsonObject<R extends JsonRestriction> = { }

type JsonTypes<R extends JsonRestriction = JsonRestriction > = {
  string: string
  number: number
  boolean: boolean
  null: null
  array: JsonArray<R>
  object: JsonObject<R>
}

type TupleOf<T> = readonly [T, ...ReadonlyArray<T>]

type JsonSchema = keyof JsonTypes | {
  type?: keyof JsonTypes | TupleOf<keyof JsonTypes>
  const?: M.JSON.Value
  properties?: {[key: string]: JsonSchema }
  additionalProperties?: boolean //todo: | JsonSchema
  required?: TupleOf<string>
  items?: JsonSchema //todo: | TupleOf<JsonSchema>
  oneOf?: TupleOf<JsonSchema>
  allOf?: TupleOf<JsonSchema>
}

type JsonRestriction = {
  type: TupleOf<keyof JsonTypes>
  const: TupleOf<M.JSON.Value>
  // items: JsonRestriction //TODO: | TupleOf<JsonRestriction>
  // properties: {[key: string]: JsonRestriction }
  // additionalProperties: boolean  //todo: | JsonRestriction
  // required: string
}

type ExpandRestrictions<S extends JsonSchema> =
  (S extends string ? { type: [S] }
  : S extends { type: infer T } 
    ? T extends string ? { type: [T] }
      : T extends TupleOf<infer Ts>  ? { type: [Ts] }
      : never
    : never)
 | (S extends { const: infer C } ? C extends M.JSON.Value ? { const: C }: never : never)
//  | (S extends { items: infer I } ? { items: ExpandRestrictions<I> } : never )
//  | (S extends { properties: infer Props } ? { properties: {- readonly [P in keyof Props]: ExpandRestrictions<Props[P]> } } : never)
//  | (S extends { additionalProperties: false } ? { additionalProperties: false } : never)
//  | (S extends { required: TupleOf<infer R> } ? R extends string ? { required: R } : never : never)
 | (S extends { allOf: infer A } ? {-readonly [P in keyof A]: ExpandRestrictions<A[P]>}[Extract<keyof A, number>] : never)

type CombineRestrictions<R extends Partial<JsonRestriction>> = Object.Overwrite<JsonRestriction, {
  [P in Extract<keyof Union.Merge<R>, keyof JsonRestriction>]:
    Union.Merge<R>[P] extends any[]
    ? List.Flatten<Extract<Union.ListOf<Union.Merge<R>[P]>, any[]>>
    : Union.Merge<R>[P]
}>

type TypeOf<R extends JsonRestriction> = JsonTypes[]
export function validate<S extends JsonSchema>(schema: S): Any.Compute<TypeOf<CombineRestrictions<ExpandRestrictions<S>>>> { throw 'nope'}
