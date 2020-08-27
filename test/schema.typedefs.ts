import { schema } from '../src/schema'


// $ExpectType AnyJSON
schema()._T

// $ExpectType null
schema('null')._T

// $ExpectType string
schema('string')._T

// $ExpectType number
schema('number')._T

// $ExpectType boolean
schema('boolean')._T

// $ExpectType JSONArray
schema('array')._T

// $ExpectType JSONObject<{}>
schema('object')._T

// $ExpectType string | number
schema(['string', 'number'])._T

// $ExpectType number | JSONArray | JSONObject<{}>
schema(['object', 'array', 'number'])._T

// $ExpectType JSONObject<{ properties: { a: number; b: string; }; }>
schema(['object'])
    .properties({
        a: schema('number'),
        b: schema('string')
    })._T
