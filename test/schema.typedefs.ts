import { is } from '../src/schema'

// $ExpectType AnyJson
is()._T

// $ExpectType null
is('null')._T

// $ExpectType string
is('string')._T

// $ExpectType number
is('number')._T

// $ExpectType number
is('integer')._T

// $ExpectType boolean
is('boolean')._T

// $ExpectType AnyJsonArray
is('array')._T

// $ExpectType AnyJsonObject
is('object')._T

// $ExpectType string | number
is('string', 'number')._T

// $ExpectType number | AnyJsonObject | AnyJsonArray
is('object', 'array', 'number')._T

// $ExpectType string | number | boolean | AnyJsonArray | JsonObject<{ properties: { a: number; }; }> | null
is().properties({ a: 'number' })._T

// $ExpectType JsonObject<{ properties: { a: number; b: string; }; }>
is('object').properties({ a: 'number', b: 'string'})._T

// $ExpectType JsonObject<{ required: "a" | "c"; }>
is('object').required('a', 'c')._T

// $ExpectType JsonObject<{ additionalProperties: false; }>
is('object').additionalProperties(false)._T

// $ExpectType AnyJsonObject
is('object').additionalProperties(true)._T

// $ExpectType JsonObject<{ additionalProperties: { type: string; }; }>
is('object').additionalProperties('string')._T

// $ExpectType number[]
is('array').items('number')._T

// $ExpectType [number, string]
is('array').items('number', 'string')._T

// $ExpectType 42
is().const(42)._T

// $ExpectType 1 | 2 | 3
is().enum(1, 2, 3)._T

// $ExpectType string | boolean
is().anyOf('string', 'boolean')._T

// $ExpectType 4 | 5
is().anyOf(is().const(4), is().const(5))._T

// $ExpectType never
is().const(1).anyOf(is().const(4))._T

// $ExpectType 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
is().anyOf(is().enum(1,2,3), is().enum(4,5,6), is().enum(7,8,9))._T

// $ExpectType 2
is().enum(1,2).anyOf(is().enum(2,3), is().enum(2, 4))._T

// $ExpectType string | number
is().anyOf('string', 'number')._T

// $ExpectType JsonObject<{ properties: { a: string | number; }; }> | JsonObject<{ properties: { c: number; }; }>
is('object').anyOf(
  is().properties({ a: is('string', 'number')}),
  is().properties({ c: 'number' })
)._T

// $ExpectType JsonObject<{ properties: { a: number; b: number; }; required: "a"; }>
is('object').properties({ a: 'number', b: 'number' }).required('a')._T

// $ExpectType JsonObject<{ required: "a" | "b"; }> | JsonObject<{ required: "a" | "c"; }>
is('object').required('a').anyOf(
  is().required('b'),
  is().required('c')
)._T

// $ExpectType JsonObject<{ properties: { a: string | number; }; }>
is('object').properties({
  a: is().anyOf('string', 'number')
})._T

// $ExpectType (string | number)[]
is('array').items(is().anyOf('string', 'number'))._T

// $ExpectType string
is().allOf(is('number', 'string'), 'string')._T

// $ExpectType never
is().allOf('number', 'string')._K

// $ExpectType number
is().allOf(is('number', 'string'), 'number')._T

// $ExpectType 42
is().allOf(is().const(42))._T

// $ExpectType 42 & { a: number; }
is().allOf(
  is().const(42),
  is().const({ a: 52 })
)._T

// $ExpectType JsonObject<{ required: "a" | "b" | "c" | "d"; }>
is('object').allOf(
  is().required('a', 'b'),
  is().required('c', 'd')
)._T

// $ExpectType string[]
is('array').allOf(
  is().items('string'),
  is().items(is().anyOf(is('string', 'number')))
)._T

// $ExpectType never[]
is('array').allOf(
  is().items('string'),
  is().items('number')
)._T

// $ExpectType JsonObject<{ properties: { a: string; c: never; b: boolean; }; }>
is('object').allOf(
  is().properties({ a: 'string', c: 'number' }),
  is().properties({
    a: is('string', 'number'),
    b: 'boolean', 
    c: 'string'
  })
)._T

// $ExpectType JsonObject<{ additionalProperties: false; }>
is('object').allOf(
  is().additionalProperties(false),
  is().additionalProperties('string')
)._T

// $ExpectType AnyJsonObject
is().allOf(
  is('object').additionalProperties(true),
  is()
)._T

// $ExpectType JsonObject<{ additionalProperties: { type: string; }; }>
is('object').allOf(
  is().additionalProperties(true),
  is().additionalProperties('string')
)._T

// $ExpectType JsonObject<{ properties: { a: number; }; }> | JsonObject<{ properties: { b: string; }; }>
is('object').oneOf(
  is().properties({ a: 'number' }),
  is().properties({ b: 'string' })
)._T

// $ExpectType number | boolean | null
is('string', 'number', 'boolean', 'null').oneOf(
  is('string', 'number'),
  is('string', 'boolean'),
  is('string', 'null'),
  is('string', 'array')
)._T

// $ExpectType number | boolean | AnyJsonObject | AnyJsonArray | null
is().not('string')._T