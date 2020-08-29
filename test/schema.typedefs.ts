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

// $ExpectType number | JsonObject<{ properties: { a: number; b: string; }; required: "a" | "c"; }>
schema(['number', 'object'])
  .properties({
      a: schema('number'),
      b: schema('string')
  })
  .required(['a', 'c'])
  ._T

// $ExpectType number | JsonObject<{ properties: { a: JsonObject<{ properties: { c: AnyJson; }; }>; b: JsonObject<{ properties: { a: number; b: string; }; required: "a" | "d"; }>; }; required: "a" | "c"; additionalProperties: false; }>
schema(['number', 'object'])
  .properties({
      a: schema('object').properties({c: schema()}),
      b: schema('object')
        .properties({
            a: schema('number'),
            b: schema('string')
        })
        .required(['a', 'd'])
    })
  .required(['a', 'c'])
  .additionalProperties(false)
  ._T
