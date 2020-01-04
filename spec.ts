import { validate, TypeOf } from './tjs'

// $ExpectType AnyJson
validate({})

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
validate({ type: 'number' })

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


// $ExpectType 42
validate({
  const: 42,
  type: 'number'
} as const)


// $ExpectType never
validate({
  allOf: [
    { const: 42 },
    { const: 43 }
  ]
} as const)

// $ExpectType 42
validate({
  allOf: [
    { const: 42 },
    { type: 'number' }
  ]
} as const)

// $ExpectType never
validate({
  allOf: [
    { const: 42 },
    { type: 'string' }
  ]
} as const)

// $ExpectType never
validate({
  const: 42,
  type: 'string'
} as const)

// $ExpectType 1 | 2
validate({
  enum: [1, 2]
} as const)

// $ExpectType 2
validate({
  allOf: [
    { enum: [1, 2] },
    { enum: [2, 3] }
  ]
} as const)

// // $ExpectType { a: 1 }
validate({
  allOf: [
    { enum: [{ a: 1 }] },
    { enum: [{ a: 1 }] }
  ]
} as const)

// $ExpectType string | number | boolean
validate({
  oneOf: [
    { type: 'string' },
    { type: 'number' },
    { type: 'boolean' }
  ]
} as const)

// $ExpectType AnyJsonArray
validate({ type: 'array' })

// $ExpectType string[]
validate({ type: 'array', items: 'string' })

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

// $ExpectType string[]
validate({
  type: 'array',
  items: { type: ['string', 'number'] },
  oneOf: [
    { items: { type: ['string', 'null'] } }
  ]
} as const)

// $ExpectType AnyJsonObject
validate({
  type: 'object'
})

// $ExpectType JsonObject<{ properties: { a: string; }; required: "a"; }>
validate({
  type: 'object',
  properties: {
    a: 'string'
  },
  required: ['a']
} as const)

// $ExpectType JsonObject<{ properties: { a: string; }; }>
validate({
  type: 'object',
  properties: { a: 'string' }
} as const)

// $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b" | "c"; }>
validate({
  type: 'object',
  properties: { a: 'string', b: 'number' },
  required: ['b', 'c']
} as const)

// $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b" | "c"; additionalProperties: false; }>
validate({
  type: 'object',
  properties: { a: 'string', b: 'number' },
  required: ['b', 'c'],
  additionalProperties: false
} as const)

// $ExpectType string | JsonObject<{ properties: { foo: string | number; bar: JsonObject<{ properties: { baz: number; }; }>; }; }>
validate({
  type: ['string', 'object'],
  properties: {
    foo: { type: ['string', 'number'] },
    bar: { type: 'object', properties: { baz: 'number' } }
  }
} as const)

// $ExpectType number | AnyJsonArray
validate({
  oneOf: [
    { type: 'array' },
    'number'
  ]
} as const)

// $ExpectType AnyJsonPrimitive
validate({
  oneOf: [ 'string', 'number', 'null', 'boolean' ]
} as const)

// $ExpectType string | number
validate({
  type: ['string', 'number', 'boolean', 'null'],
  anyOf: [ 'number', 'string' ]
} as const)


// $ExpectType JsonObject<{ properties: { a: string; }; }>
validate({
  type: 'object',
  oneOf: [
    { properties: { a : 'string' }}
  ]
} as const)

// $ExpectType JsonObject<{ properties: { a: number; b: string; c: boolean; }; }>
validate({
  type: 'object',
  allOf: [
      { properties: { a: 'number' } },
      { properties: { b: 'string' } },
      { properties: { c: 'boolean' } }
  ]
} as const)

// $ExpectType 1
validate({
  allOf: [
    { const: 1 },
    { type: 'number' }
  ]
} as const)

// $ExpectType number
validate({
  allOf: [{ 
    oneOf: [
      { type: 'number' },
      { type: 'string' }
    ],
  }, { 
    oneOf: [
      { type: 'number' },
      { type: 'object' }
    ],
  }]
} as const)

// // $ExpectType AnyJsonObject
validate({
  allOf: [{ 
    oneOf: [
      { const: 1 },
      { }
    ],
  }, { 
    oneOf: [
      { type: 'array', items: { const: 3 } },
      { type: 'object' }
    ],
  }]
} as const)

// // $ExpectType JsonObject<{ properties: { a: 42; b: 52; }; required: "a"; }>
validate({
  allOf: [
    { },
    { 
      type: 'object',
      required: ['a'],
      properties: {
        a: { const: 42 },
        b: { const: 52 }
      }
    }]
} as const)

// // $ExpectType JsonObject<{ properties: { a: 1; b: never; c: 42; }; required: "a" | "b"; }>
validate({
  allOf: [
    { 
      type: 'object',
      required: ['a'],
      properties: {
        a: { const: 1 },
        b: { const: 52 }
      }
    },
    { 
      type: 'object',
      required: ['b'],
      properties: {
        a: { type: 'number' },
        b: { const: 'asdf' },
        c: { const: 42 }
      }
    }]
} as const)

// // $ExpectType JsonObject<{ properties: { a: 1; b: never; c: 42; }; required: "b"; }>
validate({
  allOf: [
    { 
      type: 'object',
      properties: {
        a: { const: 1 },
        b: { const: 52 }
      }
    },
    { 
      type: 'object',
      required: ['b'],
      properties: {
        a: { type: 'number' },
        b: { const: 'asdf' },
        c: { const: 42 }
      }
    }]
} as const)

// // $ExpectType [JsonObject<{ properties: { a: 1; b: 52; }; }>, JsonObject<{ properties: { a: 1; b: 52; }; }>]
validate({
  allOf: [
    { 
      type: 'object',
      properties: {
        a: { const: 1 },
        b: { const: 52 }
      }
    },
    {}
  ]
} as const)

// // $ExpectType JsonObject<{ properties: { a: 1; b: 52; }; additionalProperties: false; }>
validate({
  allOf: [
    { 
      type: 'object',
      additionalProperties: false,
      properties: {
        a: { const: 1 },
        b: { const: 52 }
      }
    },
    { 
      type: 'object',
      properties: {
        a: { const: 1 },
        b: { const: 52 },
        c: { const: 32 }
      }
    }]
} as const)

// // $ExpectType JsonObject<{ properties: { a: 1; }; additionalProperties: false; }>
validate({
  allOf: [
    { 
      type: 'object',
      additionalProperties: false,
      properties: {
        a: { enum: [1, 2] },
        b: { const: 52 }
      }
    },
    { 
      type: 'object',
      additionalProperties: false,
      properties: {
        a: { enum: [1, 3] },
        c: { const: 3 }
      }
    }]
} as const)

// $ExpectType never
validate({ type: ['string'] } /* forgot as const */)

// //fixme enum keyword
