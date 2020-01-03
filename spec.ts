import { validate, AnyJsonObject, AnyJsonArray } from './tjs'

// $ExpectType AnyJson
validate({} as const)

// $ExpectType string
validate('string')

// $ExpectType number
validate('number')

// $ExpectType boolean
validate('boolean')

// $ExpectType null
validate('null')

// $ExpectType AnyJsonObject
validate('object')

// $ExpectType AnyJsonArray
validate('array')

// $ExpectType number
validate({ type: 'number' } as const)

// $ExpectType string | number
validate({ type: ['number', 'string']} as const)


// $ExpectType string
validate({
  allOf: [
    { type: 'string' }
  ]
} as const)


// $ExpectType never
validate({
  type: 'number',
  allOf: [
    { type: 'string' }
  ]
} as const)

// $ExpectType string
validate({ allOf: [
  { type: ['string', 'number'] },
  { type: ['string', 'object'] }
]} as const)


// // $ExpectType { const: 42; type: "string" }
// validate({ allOf: [
//   { const: 42 },
//   { type: 'string' }
// ]} as const)


// // $ExpectType { const: 42; type: "string" }
// validate({ allOf: [
//   { const: 42 },
//   { const: 42 },
//   { type: 'string' }
// ]} as const)

// // $ExpectType { const: never; }
// validate({ allOf: [
//   { const: 42 },
//   { const: 34 }
// ]} as const)

// // $ExpectType { const: never; }
// validate({
//   oneOf: [
//     { type: 'string' },
//     { type: 'number' },
//     { type: 'boolean' }
//   ]
// })

// // $ExpectType AnyJsonArray
// validate({ type: 'array' } as const)

// $ExpectType string[]
validate({ type: 'array', items: 'string' } as const)

// $ExpectType (string | number)[]
validate({ type: 'array', items: { type: ['string', 'number'] } } as const)

// $ExpectType string[]
validate({
  type: 'array',
  allOf: [
    { items: { type: ['string', 'number'] } },
    { items: { type: ['string', 'object'] } }
  ]
} as const)

// // $ExpectType string[]
// validate({
//   type: 'array',
//   items: { type: ['string', 'number'] },
//   oneOf: [
//     { items: { type: ['string', 'null'] } }
//   ]
// } as const)

// // $ExpectType AnyJsonObject
// validate({
//   type: 'object'
// } as const)

// // $ExpectType JsonObject<{ properties: { a: string; }; required: "a"; }>
// validate({
//   type: 'object',
//   properties: {
//     a: 'string'
//   },
//   required: ['a']
// } as const)

// // $ExpectType JsonObject<{ properties: { a: string; }; }>
// validate({
//   type: 'object',
//   properties: { a: 'string' }
// } as const)

// // $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b" | "c"; }>
// validate({
//   type: 'object',
//   properties: { a: 'string', b: 'number' },
//   required: ['b', 'c']
// } as const)

// // $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b" | "c"; additionalProperties: false; }>
// validate({
//   type: 'object',
//   properties: { a: 'string', b: 'number' },
//   required: ['b', 'c'],
//   additionalProperties: false
// } as const)

// // $ExpectType string | JsonObject<{ properties: { foo: string | number; bar: JsonObject<{ properties: { baz: number; }; }>; }; }>
// validate({
//   type: ['string', 'object'],
//   properties: {
//     foo: { type: ['string', 'number'] },
//     bar: { type: 'object', properties: { baz: 'number' } }
//   }
// } as const)

// // $ExpectType number | AnyJsonArray
// validate({
//   oneOf: [
//     { type: 'array' },
//     'number'
//   ]
// } as const)

// // $ExpectType AnyJsonPrimitive
// validate({
//   oneOf: [ 'string', 'number', 'null', 'boolean' ]
// } as const)

// // $ExpectType string | number
// validate({
//   type: ['string', 'number', 'boolean', 'null'],
//   oneOf: [ 'number', 'string' ]
// } as const)


// // $ExpectType JsonObject<{ properties: { a: string; }; }>
// validate({
//   type: 'object',
//   oneOf: [
//     { properties: { a : 'string' }}
//   ]
// } as const)


// // $ExpectType JsonObject<{ properties: { a: number; b: string; c: boolean; }; }>
// validate({
//   type: 'object',
//   allOf: [
//       { properties: { a: 'number' } },
//       { properties: { b: 'string' } },
//       { properties: { c: 'boolean' } }
//   ]
// } as const)

// // $ExpectType never
// validate({ type: 'string' } /* forgot as const */)

// function bothOf<A, B>():[BothOf<A,B>, BothOf<B, A>] { throw 'nope'}

// // $ExpectType [1, 1]
// bothOf<1, number>()

// // $ExpectType [1, 1]
// bothOf<1 | AnyJsonObject, number | AnyJsonArray>()

// // $ExpectType [AnyJsonObject, AnyJsonObject]
// bothOf<1 | AnyJsonObject, [3] | JsonObject<{ properties: { } }>>()

// // $ExpectType [JsonObject<{ properties: { a: 42; b: 52; }; required: "a"; }>, JsonObject<{ properties: { a: 42; b: 52; }; required: "a"; }>]
// bothOf<AnyJsonObject, JsonObject<{ properties: {a: 42, b: 52 }, required: 'a' }>>()

// // $ExpectType [JsonObject<{ properties: { a: 1; b: never; c: 42; }; required: "a" | "b"; }>, JsonObject<{ properties: { a: 1; b: never; c: 42; }; required: "a" | "b"; }>]
// bothOf<JsonObject<{ properties: {a: 1, b: 52}, required: 'a' }>, JsonObject<{ properties: {a: number, b: "asdf", c: 42}, required: 'b' }>>()

// // $ExpectType [JsonObject<{ properties: { a: 1; b: never; c: 42; }; required: "b"; }>, JsonObject<{ properties: { a: 1; b: never; c: 42; }; required: "b"; }>]
// bothOf<JsonObject<{ properties: {a: 1, b: 52} }>, JsonObject<{ properties: {a: number, b: "asdf", c: 42}, required: 'b' }>>()

// // $ExpectType [JsonObject<{ properties: { a: 1; b: 52; }; }>, JsonObject<{ properties: { a: 1; b: 52; }; }>]
// bothOf<JsonObject<{ properties: {a: 1, b: 52} }>, AnyJsonObject>()

// // $ExpectType [JsonObject<{ properties: { a: 1; b: 52; }; additionalProperties: false; }>, JsonObject<{ properties: { a: 1; b: 52; }; additionalProperties: false; }>]
// bothOf<JsonObject<{ properties: {a: 1, b: 52}, additionalProperties: false }>, JsonObject<{ properties: {a: 1, b: 52, c: 32}}>>()

// // $ExpectType [JsonObject<{ properties: { a: 1; }; additionalProperties: false; }>, JsonObject<{ properties: { a: 1; }; additionalProperties: false; }>]
// bothOf<JsonObject<{ properties: {a: 1 | 2, b: 52}, additionalProperties: false }>, JsonObject<{ properties: {a: 1 | 3, c: 3 }, additionalProperties: false }>>()

// //fixme const keyword
// //fixme enum keyword
// //fixme combining additional properties / required fields