import { TypeOf, JsonSchemaInput, Struct } from '..'
import { Any } from 'ts-toolbelt'

const getType = <S extends JsonSchemaInput>(s: S): TypeOf<S> => { throw 'nope' }
const pickType = <S extends JsonSchemaInput, Keys extends string>(s: S, k: Keys[]): Any.Compute<Pick<TypeOf<S>, Extract<Keys, keyof TypeOf<S>>>> => { throw 'types only' }

// $ExpectType AnyJson
getType(<const>{})

// $ExpectType string
getType('string')

// $ExpectType number
getType('number')

// $ExpectType boolean
getType('boolean')

// $ExpectType null
getType('null')

// $ExpectType AnyJsonObject
getType('object')

// $ExpectType AnyJsonArray
getType('array')

// $ExpectType number
getType(<const>{ type: 'number' })

// $ExpectType string | number
getType(<const>{ type: ['number', 'string']})

// $ExpectType string
getType(<const>{
  allOf: [
    { type: 'string' }
  ]
})


// $ExpectType never
getType(<const>{
  type: 'number',
  allOf: [
    { type: 'string' }
  ]
})

// $ExpectType string
getType(<const>{ allOf: [
  { type: ['string', 'number'] },
  { type: ['string', 'object'] }
]})


// $ExpectType 42
getType(<const>{
  const: 42
})

// $ExpectType 42
getType(<const>{
  const: 42,
  type: 'number'
})


// $ExpectType never
getType(<const>{
  allOf: [
    { const: 42 },
    { const: 43 }
  ]
})

// $ExpectType 42
getType(<const>{
  allOf: [
    { const: 42 },
    { type: 'number' }
  ]
})

// $ExpectType never
getType(<const>{
  allOf: [
    { const: 42 },
    { type: 'string' }
  ]
})

// FIXME $ExpectType 42 | string
getType(<const>{
  oneOf: [
    { const: 42 },
    { type: 'string' }
  ]
})

// $ExpectType never
getType(<const>{
  const: 42,
  type: 'string'
})

// $ExpectType 1 | 2
getType(<const>{
  enum: [1, 2]
})

// $ExpectType 2
getType(<const>{
  allOf: [
    { enum: [1, 2] },
    { enum: [2, 3] }
  ]
})

// FIXME $ExpectType { a: 1 }
getType(<const>{
  allOf: [
    { enum: [{ a: 1 }] },
    { enum: [{ a: 1 }] }
  ]
})

// FIXME $ExpectType 1 | string
getType(<const>{
  oneOf: [
    { enum: [1] },
    { type: 'string' }
  ]
})

// $ExpectType string | number | boolean
getType(<const>{
  oneOf: [
    { type: 'string' },
    { type: 'number' },
    { type: 'boolean' }
  ]
})

// $ExpectType AnyJsonArray
getType(<const>{ type: 'array' })

// $ExpectType string[]
getType(<const>{ type: 'array', items: 'string' })

// $ExpectType (string | number)[]
getType(<const>{ type: 'array', items: { type: ['string', 'number'] } })

// $ExpectType string[]
getType(<const>{
  type: 'array',
  allOf: [
    { items: { type: ['string', 'number'] } },
    { items: { type: ['string', 'object'] } }
  ]
})

// $ExpectType string[]
getType(<const>{
  type: 'array',
  items: { type: ['string', 'number'] },
  oneOf: [
    { items: { type: ['string', 'null'] } }
  ]
})

// $ExpectType AnyJsonObject
getType(<const>{
  type: 'object'
})

// $ExpectType { a: string; b?: string | undefined; c: AnyJson; }
pickType(<const>{
  type: 'object',
  properties: {
    a: 'string',
    b: 'string'
  },
  required: ['a']
}, ['a', 'b', 'c'])

// $ExpectType { a: string; b?: string | undefined; }
pickType(<const>{
  type: 'object',
  additionalProperties: false,
  properties: {
    a: 'string',
    b: 'string'
  },
  required: ['a']
}, ['a', 'b', 'c' ])

// $ExpectType JsonObject<{ properties: { a: string; b: string; }; required: "a"; }>
getType(<const>{
  type: 'object',
  properties: {
    a: 'string',
    b: 'string'
  },
  required: ['a']
})

// $ExpectType JsonObject<{ properties: { a: string; }; }>
getType(<const>{
  type: 'object',
  properties: { a: 'string' }
})

// $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b" | "c"; }>
getType(<const>{
  type: 'object',
  properties: { a: 'string', b: 'number' },
  required: ['b', 'c']
})

// $ExpectType JsonObject<{ properties: { a: string; b: number; }; required: "b" | "c"; additionalProperties: false; }>
getType(<const>{
  type: 'object',
  properties: { a: 'string', b: 'number' },
  required: ['b', 'c'],
  additionalProperties: false
})

// $ExpectType string | JsonObject<{ properties: { foo: string | number; bar: JsonObject<{ properties: { baz: number; }; }>; }; }>
getType(<const>{
  type: ['string', 'object'],
  properties: {
    foo: { type: ['string', 'number'] },
    bar: { type: 'object', properties: { baz: 'number' } }
  }
})

// $ExpectType number | AnyJsonArray
getType(<const>{
  oneOf: [
    { type: 'array' },
    'number'
  ]
})

// $ExpectType AnyJsonPrimitive
getType(<const>{
  oneOf: [ 'string', 'number', 'null', 'boolean' ]
})

// $ExpectType string | number
getType(<const>{
  type: ['string', 'number', 'boolean', 'null'],
  anyOf: [ 'number', 'string' ]
})


// $ExpectType JsonObject<{ properties: { a: string; }; }>
getType(<const>{
  type: 'object',
  oneOf: [
    { properties: { a : 'string' }}
  ]
})

// $ExpectType JsonObject<{ properties: { a: number; b: string; c: boolean; }; }>
getType(<const>{
  type: 'object',
  allOf: [
      { properties: { a: 'number' } },
      { properties: { b: 'string' } },
      { properties: { c: 'boolean' } }
  ]
})

// $ExpectType number
getType(<const>{
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
getType(<const>{
  allOf: [
    { type: 'object', properties: { a: 'string' }, additionalProperties: false },
    { type: 'object', properties: { a: 'string' } }
  ]
})

// FIXME $ExpectType JsonObject<{ properties: { a: string; }; additionalProperties: false; }>
getType(<const>{
  allOf: [
    { type: 'object', properties: { a: 'string' }, additionalProperties: false },
    { type: 'object', properties: { a: 'string', b: 'string' } }
  ]
})

// FIXME $ExpectType AnyJsonObject
getType(<const>{
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
getType(<const>{
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
getType(<const>{
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
getType(<const>{
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
getType(<const>{
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
getType(<const>{
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
getType(<const>{
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

// $ExpectType Promise<JsonObject<{ properties: { a: number; b: string; }; required: "a" | "b"; additionalProperties: false; }>>
Struct(<const>{
  a: 'number',
  b: 'string'
}).validate(null)

// $ExpectType Promise<JsonObject<{ properties: { a: number; b: string; }; required: "b"; additionalProperties: false; }>>
Struct(<const>{
  a: 'number',
  b: 'string'
}, {
  optional: ['a']
}).validate(null)
