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

// $ExpectType JSONObject
schema('object')._T

// $ExpectType string | number
schema(['string', 'number'])._T

// $ExpectType JSONObject | JSONArray | number
schema(['object', 'array', 'number'])._T