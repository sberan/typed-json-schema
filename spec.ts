import { validate, TypeOf } from './tjs'

// $ExpectType AnyJson
validate(<const>{})

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
validate(<const>{ type: 'number' })

// $ExpectType string | number
validate(<const>{ type: ['number', 'string']})

// $ExpectType string
validate(<const>{
  allOf: [
    { type: 'string' }
  ]
})


// $ExpectType never
validate(<const>{
  type: 'number',
  allOf: [
    { type: 'string' }
  ]
})

// $ExpectType string
validate(<const>{ allOf: [
  { type: ['string', 'number'] },
  { type: ['string', 'object'] }
]})


// $ExpectType 42
validate(<const>{
  const: 42
})

// $ExpectType 42
validate(<const>{
  const: 42,
  type: 'number'
})


// $ExpectType never
validate(<const>{
  allOf: [
    { const: 42 },
    { const: 43 }
  ]
})

// $ExpectType 42
validate(<const>{
  allOf: [
    { const: 42 },
    { type: 'number' }
  ]
})

// $ExpectType never
validate(<const>{
  allOf: [
    { const: 42 },
    { type: 'string' }
  ]
})

// FIXME $ExpectType 42 | string
validate(<const>{
  oneOf: [
    { const: 42 },
    { type: 'string' }
  ]
})

// $ExpectType never
validate(<const>{
  const: 42,
  type: 'string'
})

// $ExpectType 1 | 2
validate(<const>{
  enum: [1, 2]
})

// $ExpectType 2
validate(<const>{
  allOf: [
    { enum: [1, 2] },
    { enum: [2, 3] }
  ]
})

// FIXME $ExpectType { a: 1 }
validate(<const>{
  allOf: [
    { enum: [{ a: 1 }] },
    { enum: [{ a: 1 }] }
  ]
})

// FIXME $ExpectType 1 | string
validate(<const>{
  oneOf: [
    { enum: [1] },
    { type: 'string' }
  ]
})

// $ExpectType string | number | boolean
validate(<const>{
  oneOf: [
    { type: 'string' },
    { type: 'number' },
    { type: 'boolean' }
  ]
})

// $ExpectType AnyJsonArray
validate(<const>{ type: 'array' })

// $ExpectType string[]
validate(<const>{ type: 'array', items: 'string' })

// $ExpectType (string | number)[]
validate(<const>{ type: 'array', items: { type: ['string', 'number'] } })

// $ExpectType string[]
validate(<const>{
  type: 'array',
  allOf: [
    { items: { type: ['string', 'number'] } },
    { items: { type: ['string', 'object'] } }
  ]
})

// $ExpectType string[]
validate(<const>{
  type: 'array',
  items: { type: ['string', 'number'] },
  oneOf: [
    { items: { type: ['string', 'null'] } }
  ]
})

// $ExpectType AnyJsonObject
validate(<const>{
  type: 'object'
})

// $ExpectType JsonObject<{ properties: { a: string; }; required: "a"; }>
validate(<const>{
  type: 'object',
  properties: {
    a: 'string',
    b: 'string'
  },
  required: ['a']
})

// $ExpectType JsonObject<{ properties: { a: string; }; }>
validate(<const>{
  type: 'object',
  properties: { a: 'string' }
})

// FIXME $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b" | "c"; }>
// $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b"; }> | JsonObject<{ properties: { a: string; b: number; }; required: "c"; }>
validate(<const>{
  type: 'object',
  properties: { a: 'string', b: 'number' },
  required: ['b', 'c']
})

// FIXME $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b" | "c"; additionalProperties: false; }>
// $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b"; additionalProperties: false; }> | JsonObject<{ properties: { a: string; b: number; }; required: "c"; additionalProperties: false; }>
validate(<const>{
  type: 'object',
  properties: { a: 'string', b: 'number' },
  required: ['b', 'c'],
  additionalProperties: false
})

// $ExpectType string | JsonObject<{ properties: { foo: string | number; bar: JsonObject<{ properties: { baz: number; }; }>; }; }>
validate(<const>{
  type: ['string', 'object'],
  properties: {
    foo: { type: ['string', 'number'] },
    bar: { type: 'object', properties: { baz: 'number' } }
  }
})

// $ExpectType number | AnyJsonArray
validate(<const>{
  oneOf: [
    { type: 'array' },
    'number'
  ]
})

// $ExpectType AnyJsonPrimitive
validate(<const>{
  oneOf: [ 'string', 'number', 'null', 'boolean' ]
})

// $ExpectType string | number
validate(<const>{
  type: ['string', 'number', 'boolean', 'null'],
  anyOf: [ 'number', 'string' ]
})


// $ExpectType JsonObject<{ properties: { a: string; }; }>
validate(<const>{
  type: 'object',
  oneOf: [
    { properties: { a : 'string' }}
  ]
})

// $ExpectType JsonObject<{ properties: { a: number; b: string; c: boolean; }; }>
validate(<const>{
  type: 'object',
  allOf: [
      { properties: { a: 'number' } },
      { properties: { b: 'string' } },
      { properties: { c: 'boolean' } }
  ]
})

// $ExpectType number
validate(<const>{
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
})

// $ExpectType JsonObject<{ properties: { a: string; }; additionalProperties: false; }>
validate(<const>{
  allOf: [
    { type: 'object', properties: { a: 'string' }, additionalProperties: false },
    { type: 'object', properties: { a: 'string' } }
  ]
})

// FIXME $ExpectType JsonObject<{ properties: { a: string; }; additionalProperties: false; }>
validate(<const>{
  allOf: [
    { type: 'object', properties: { a: 'string' }, additionalProperties: false },
    { type: 'object', properties: { a: 'string', b: 'string' } }
  ]
})

// FIXME $ExpectType AnyJsonObject
validate(<const>{
  allOf: [{ 
    oneOf: [
      { const: 1 },
      { type: 'object' }
    ],
  }, { 
    oneOf: [
      { type: 'array', items: { const: 3 } },
      { type: 'object' }
    ],
  }]
})

// FIXME $ExpectType JsonObject<{ properties: { a: 42; b: 52; }; required: "a"; }>
validate(<const>{
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
})

// FIXME $ExpectType JsonObject<{ properties: { a: 1; b: never; c: 42; }; required: "a" | "b"; }>
validate(<const>{
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
})

// FIXME $ExpectType JsonObject<{ properties: { a: 1; b: never; c: 42; }; required: "b"; }>
validate(<const>{
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
})

// FIXME $ExpectType [JsonObject<{ properties: { a: 1; b: 52; }; }>, JsonObject<{ properties: { a: 1; b: 52; }; }>]
validate(<const>{
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
})

// FIXME $ExpectType JsonObject<{ properties: { a: 1; b: 52; }; additionalProperties: false; }>
validate(<const>{
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
})

// FIXME $ExpectType JsonObject<{ properties: { a: 1; }; additionalProperties: false; }>
validate(<const>{
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
})
