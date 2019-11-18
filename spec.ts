import { validate, AnyJson, AnyJsonObject, JsonObject, BothOf, AnyJsonArray } from './tjs'

// $ExpectType AnyJson
validate({})

// $ExpectType string
validate('string')

// $ExpectType number
validate({ type: 'number' })

// $ExpectType string | number
validate({ type: ['number', 'string']})

// $ExpectType AnyJsonArray
validate({ type: 'array' })

// $ExpectType string[]
validate({ type: 'array', items: 'string' })

// $ExpectType (string | number)[]
validate({ type: 'array', items: { type: ['string', 'number'] } })

// $ExpectType string[]
validate({
  type: 'array',
  items: { type: ['string', 'number'] },
  oneOf: [
    { items: { type: ['string', 'null'] } }
  ]
})

// $ExpectType AnyJsonObject
validate({
  type: 'object'
})

// $ExpectType JsonObject<"a", { a: string; }>
validate({
  type: 'object',
  properties: {
    a: 'string'
  },
  required: ['a'] as const
})

// $ExpectType AnyJsonObject
validate({
  type: 'object',
  properties: { a: 'string' }
})

// $ExpectType JsonObject<"b" | "c", { a: string; b: number; }>
validate({
  type: 'object',
  properties: { a: 'string', b: 'number' },
  required: ['b', 'c'] as const
})

// $ExpectType JsonObject<"b" | "c", { a: string; b: number; }>
validate({
  type: 'object',
  properties: { a: 'string', b: 'number' },
  required: ['b', 'c'] as const,
  additionalProperties: false
})

// $ExpectType string | JsonObject<"foo", { foo: string | number; bar: JsonObject<"baz", { baz: number; }>; }>
validate({
  type: ['string', 'object'],
  properties: {
    foo: { type: ['string', 'number' ]},
    bar: { type: 'object', properties: { baz: 'number' }, required: ['baz'] as const }
  },
  required: ['foo'] as const
})

// $ExpectType number | AnyJsonArray
validate({
  oneOf: [
    { type: 'array' },
    'number'
  ]
})

// $ExpectType AnyJsonPrimitive
validate({
  oneOf: [ 'string', 'number', 'null', 'boolean' ]
})

// $ExpectType string | number
validate({
  type: ['string', 'number', 'boolean', 'null'],
  oneOf: [ 'number', 'string' ]
})

// $ExpectType AnyJsonObject
validate({
  type: 'object'
})

function bothOf<A, B>():[BothOf<A,B>, BothOf<B, A>] { throw 'nope'}

// $ExpectType [1, 1]
bothOf<1, number>()

// $ExpectType [1, 1]
bothOf<1 | AnyJsonObject, number | AnyJsonArray>()

// $ExpectType [AnyJsonObject, AnyJsonObject]
bothOf<1 | AnyJsonObject, [3] | JsonObject<"", {}>>()

// $ExpectType [JsonObject<"a", { a: 42; b: 52; }>, JsonObject<"a", { a: 42; b: 52; }>]
bothOf<AnyJsonObject, JsonObject<"a", {a: 42, b: 52}>>()

// $ExpectType [JsonObject<"a" | "b", { a: 1; b: never; }>, JsonObject<"a" | "b", { a: 1; b: never; }>]
bothOf<JsonObject<"a", {a: 1, b: 52}>, JsonObject<"b", {a: number, b: "asdf", c: 42}>>()