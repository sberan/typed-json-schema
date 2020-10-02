import { schema } from '../src/schema'

// $ExpectType AnyJson
schema()._T

// $ExpectType null
schema('null')._T

// $ExpectType string
schema('string')._T

// $ExpectType number
schema('number')._T

// $ExpectType boolean
schema('boolean')._T

// $ExpectType AnyJsonArray
schema('array')._T

// $ExpectType AnyJsonObject
schema('object')._T

// $ExpectType string | number
schema('string', 'number')._T

// $ExpectType number | AnyJsonObject | AnyJsonArray
schema('object', 'array', 'number')._T

// $ExpectType string | number | boolean | AnyJsonArray | JsonObject<{ properties: { a: number; }; }> | null
schema().properties({ a: 'number' })._T

// $ExpectType JsonObject<{ properties: { a: number; b: string; }; }>
schema('object').properties({ a: 'number', b: 'string'})._T

// $ExpectType JsonObject<{ required: "a" | "c"; }>
schema('object').required('a', 'c')._T

// $ExpectType JsonObject<{ additionalProperties: false; }>
schema('object').additionalProperties(false)._T

// $ExpectType AnyJsonObject
schema('object').additionalProperties(true)._T

// $ExpectType JsonObject<{ additionalProperties: { type: string; }; }>
schema('object').additionalProperties('string')._T

// $ExpectType number[]
schema('array').items('number')._T

// $ExpectType [number, string]
schema('array').items('number', 'string')._T

// $ExpectType 42
schema().const(42)._T

// $ExpectType 1 | 2 | 3
schema().enum(1, 2, 3)._T

// $ExpectType string | boolean
schema().anyOf('string', 'boolean')._T

// $ExpectType 4 | 5
schema().anyOf(schema().const(4), schema().const(5))._T

// $ExpectType never
schema().const(1).anyOf(schema().const(4))._T

// $ExpectType 9 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
schema().anyOf(schema().enum(1,2,3), schema().enum(4,5,6), schema().enum(7,8,9))._T

// $ExpectType 2
schema().enum(1,2).anyOf(schema().enum(2,3), schema().enum(2, 4))._T

// $ExpectType string | number
schema().anyOf('string', 'number')._T

// $ExpectType JsonObject<{ properties: { a: string | number; c: number; }; }>
schema('object').anyOf(
  schema().properties({ a: schema('string', 'number')}),
  schema().properties({ c: 'number' })
)._T

// $ExpectType JsonObject<{ properties: { a: number; b: number; }; required: "a"; }>
schema('object').properties({ a: 'number', b: 'number' }).required('a')._T

// $ExpectType JsonObject<{ required: "a" | "b" | "c"; }>
schema('object').required('a').anyOf(
  schema().required('b'),
  schema().required('c')
)._T

// $ExpectType JsonObject<{ properties: { a: string | number; }; }>
schema('object').properties({
  a: schema().anyOf('string', 'number')
})._T

// $ExpectType (string | number)[]
schema('array').items(schema().anyOf('string', 'number'))._T

// $ExpectType string
schema().allOf(schema('number', 'string'), 'string')._T

// $ExpectType never
schema().allOf('number', 'string')._T

// $ExpectType number
schema().allOf(schema('number', 'string'), 'number')._T

// $ExpectType 42
schema().allOf(schema().const(42))._T

// $ExpectType 42 & { a: number; }
schema().allOf(
  schema().const(42),
  schema().const({ a: 52 })
)._T

// $ExpectType JsonObject<{ required: "a" | "b" | "c" | "d"; }>
schema('object').allOf(
  schema().required('a', 'b'),
  schema().required('c', 'd')
)._T

// $ExpectType string[]
schema('array').allOf(
  schema().items('string'),
  schema().items(schema().anyOf(schema('string', 'number')))
)._T

// $ExpectType never[]
schema('array').allOf(
  schema().items('string'),
  schema().items('number')
)._T

// $ExpectType JsonObject<{ properties: { a: string; c: never; b: boolean; }; }>
schema('object').allOf(
  schema().properties({ a: 'string', c: 'number' }),
  schema().properties({
    a: schema('string', 'number'),
    b: 'boolean', 
    c: 'string'
  })
)._T

// $ExpectType JsonObject<{ additionalProperties: false; }>
schema('object').allOf(
  schema().additionalProperties(false),
  schema().additionalProperties('string')
)._T

// $ExpectType AnyJsonObject
schema().allOf(
  schema('object').additionalProperties(true),
  schema()
)._T

// $ExpectType JsonObject<{ additionalProperties: { type: string; }; }>
schema('object').allOf(
  schema().additionalProperties(true),
  schema().additionalProperties('string')
)._T
