import { Object, List, Union, Any, M } from 'ts-toolbelt'

type JsonArray<R extends JsonRestriction['array']> = []

type JsonObject<R extends JsonRestriction['object']> = { }

type JsonTypes<R extends JsonRestriction = JsonRestriction > = {
  string: string
  number: number
  boolean: boolean
  null: null
  array: M.JSON.Array
  object: JsonObject<R['object']>
}

type TupleOf<T> = readonly [T, ...ReadonlyArray<T>]

type JsonSchema = keyof JsonTypes | {
  type?: keyof JsonTypes | TupleOf<keyof JsonTypes>
  const?: M.JSON.Object
  properties?: {[key: string]: JsonSchema }
  additionalProperties?: boolean //todo: | JsonSchema
  required?: TupleOf<string>
  items?: JsonSchema //todo: | TupleOf<JsonSchema>
  oneOf?: TupleOf<JsonSchema>
  allOf?: TupleOf<JsonSchema>
}

type JsonRestriction = {
  type: keyof JsonTypes
  const: M.JSON.Value
  array: {
    items: JsonRestriction //TODO: | TupleOf<JsonRestriction>
  }
  object: {
    properties: {[key: string]: JsonRestriction }
    additionalProperties: boolean  //todo: | JsonRestriction
    required: string
  }
}

type Convert<S extends JsonSchema> = Any.Compute<{
  type: S extends string ? S
    : S extends { type: TupleOf<infer T> } ? T
    : S extends { type: infer T } ? T
    : keyof JsonTypes

  const: S extends { const: infer C } ? C : M.JSON.Value

  array: {
    items: S extends { items: infer I } ? Convert<I> : JsonRestriction
  }

  object: {
    properties: S extends { properties: infer Props } ? {[P in keyof Props]: Convert<Props[P]> } : {}
    additionalProperties: S extends { additionalProperties: false } ? false : true
    required: S extends { required: TupleOf<infer R> } ? R : never
  }
}>

const keyword = validate('string')

const typeString = validate({ type: 'array', items: { type: ['string', 'number'] } } as const)
const obj = validate({ type: 'object', required: ['a'], properties: { a: { type: ['string', 'number']} } } as const)

function validate<S extends JsonSchema>(schema: S): Convert<S> { throw 'nope'}

// type Simplify<R extends JsonRestrictions> = Any.Compute<{
//   excludeType: R[keyof R]['excludeType']
//   properties:  {[P in keyof Union.Merge<R[keyof R]['properties']>]: Simplify<Any.Cast<Union.Merge<R[keyof R]['properties']>[P], JsonRestrictions>> }
// }>


// const combine = <A extends JsonRestrictions>(): JsonType<Simplify<A>> => {throw 'nope'}

// const x = combine<{
//   one: {
//     excludeType: 'number' | 'string',
//     properties: { 
//       a: { x: { excludeType: 'number', properties: {} } }
//     }
//   },
//   two: {
//     excludeType: 'boolean',
//     properties: { 
//       a: { x: { excludeType: 'string', properties: {} } },
//       b: { x: { excludeType: 'string', properties: {} } }
//     }
//   },
// }>()