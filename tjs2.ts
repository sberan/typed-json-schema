import { Object, List, Union, Any, M } from 'ts-toolbelt'

type JsonArray<R extends JsonRestriction> = []

type JsonObject<R extends JsonRestriction> = { }

type JsonTypes<R extends JsonRestriction = JsonRestriction > = {
  string: string
  number: number
  boolean: boolean
  null: null
  array: M.JSON.Array
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
  const: M.JSON.Value
  items: JsonRestriction //TODO: | TupleOf<JsonRestriction>
  properties: {[key: string]: JsonRestriction }
  additionalProperties: boolean  //todo: | JsonRestriction
  required: string
}

type Expand<S extends JsonSchema> =
  (S extends string ? { type: [S] }
  : S extends { type: infer T } ? { type: T extends string ? Union.ListOf<T> : T}
  : never)
 | (S extends { const: infer C } ? C extends M.JSON.Value ? { const: C }: never : never)
 | (S extends { items: infer I } ? { items: Expand<I> } : never )
 | (S extends { properties: infer Props } ? { properties: {- readonly [P in keyof Props]: Expand<Props[P]> } } : never)
 | (S extends { additionalProperties: false } ? { additionalProperties: false } : never)
 | (S extends { required: TupleOf<infer R> } ? R extends string ? { required: R } : never : never)
 | (S extends { allOf: infer A } ? {-readonly [P in keyof A]: Expand<A[P]>}[Extract<keyof A, number>] : never)

type Combine<R extends Partial<JsonRestriction>> = {
  [P in keyof Union.Merge<R>]: 
    Union.Merge<R>[P] }

const keyword = validate('string')

const asConst = validate({ type: 'string', const: 42 } as const)

const typeString = validate({ type: 'array', items: { type: ['string', 'number'] } } as const)
const obj = validate({ type: 'object', required: ['a'], properties: { a: { type: ['string', 'number']} } } as const)
const allOf = validate({ allOf: [
    { properties: { a: 'string' } }, 
    { properties: { b: 'number' } }, 
    { properties: { a: 'string', c: 'number' } }
]} as const)
const never = validate({ type: 'string', allOf: [{ type: 'object' }]} as const)
const string = validate({ type: ['string', 'object'], allOf: [{ type: 'string' }]} as const)
function validate<S extends JsonSchema>(schema: S): Any.Compute<Combine<Expand<S>>> { throw 'nope'}
