import { schema } from '../src/schema'

// $ExpectType AnyJson
schema()._T

// $ExpectType never
schema([])._T

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
schema(['string', 'number'])._T

// $ExpectType number | AnyJsonObject | AnyJsonArray
schema(['object', 'array', 'number'])._T

// $ExpectType JsonObject<{ properties: { a: number; b: string; }; }>
schema(['object'])
  .properties({
      a: schema('number'),
      b: schema('string')
  })
  ._T

// $ExpectType JsonObject<{ required: "a" | "c"; }>
schema(['object']).required(['a', 'c'])._T

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
