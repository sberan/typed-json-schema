import { schema } from '../src/schema'

// TODO $ExpectType AnyJson
// $ExpectType string | number | boolean | AnyJsonObject | AnyJsonArray | null
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
schema().properties({ a: schema('number') })._T

// $ExpectType JsonObject<{ properties: { a: number; b: string; }; }>
schema('object')
  .properties({
      a: schema('number'),
      b: schema('string')
  })
  ._T

// $ExpectType JsonObject<{ required: "a" | "c"; }>
schema('object').required('a', 'c')._T

// $ExpectType JsonObject<{ additionalProperties: false; }>
schema('object').additionalProperties(false)._T

// $ExpectType AnyJsonObject
schema('object').additionalProperties(true)._T

// $ExpectType JsonObject<{ additionalProperties: { type: string; }; }>
schema('object').additionalProperties(schema('string'))._T

// $ExpectType number[]
schema('array').items(schema('number'))._T

// $ExpectType [number, string]
schema('array').items(schema('number'), schema('string'))._T

// // $ExpectType [number]
// schema('array').items([schema('number')])._T // tuple with a single item

// $ExpectType 42
schema().const(42)._T

// $ExpectType 1 | 2 | 3
schema().enum(1, 2, 3)._T

// $ExpectType string | boolean
schema().oneOf(schema('string'), schema('boolean'))._T

// $ExpectType 4 | 5
schema().oneOf(schema().const(4), schema().const(5))._T

// $ExpectType never
schema().const(1).oneOf(schema().const(4))._T

// $ExpectType 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
schema().oneOf(schema().enum(1,2,3), schema().enum(4,5,6), schema().enum(7,8,9))._T

// $ExpectType 2
schema().enum(1,2).oneOf(schema().enum(2,3), schema().enum(2, 4))._T

// $ExpectType JsonObject<{ properties: { a: number; b: number; }; }> | JsonObject<{ properties: { a: number; c: number; }; }>
schema('object').properties({ a: schema('number') }).oneOf(
  schema().properties({ b: schema('number') }),
  schema().properties({ c: schema('number') })
)._T  

// $ExpectType JsonObject<{ required: "a" | "b"; }> | JsonObject<{ required: "a" | "c"; }>
schema('object').required('a').oneOf(
  schema('object').required('b'),
  schema('object').required('c')
)._T