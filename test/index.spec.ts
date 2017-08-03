import { expect } from 'chai'
import { schema, Schema } from '../src/schema'

function expectSchema(schema: Schema<any>) {
  return expect(schema.toJSON())
}

describe('JSON schema', () => {
  it('should create a number schema', () => {
    expectSchema(schema.type('number').maximum(4).minimum(3)).to.eql({ type: 'number', maximum: 4, minimum: 3 })
    expectSchema(schema.type('number').exclusiveMaximum(4).exclusiveMinimum(3)).to.eql({ type: 'number', exclusiveMaximum: 4, exclusiveMinimum: 3 })
    expectSchema(schema.type('number').maximum(4).minimum(3).exclusiveMaximum(true).exclusiveMinimum(true)).to.eql({ type: 'number', maximum: 4, minimum: 3, exclusiveMaximum: true, exclusiveMinimum: true })
    expectSchema(schema.type('number').multipleOf(3)).to.eql({ type: 'number', multipleOf: 3 })
  })
  it('should create a string schema', () => {
    expectSchema(schema.type('string')).to.eql({ type: 'string' })
    expectSchema(schema.type('string').minLength(3).maxLength(5)).to.eql({ type: 'string', minLength: 3, maxLength: 5 })
    expectSchema(schema.type('string').pattern(/\w+/)).to.eql({ type: 'string', pattern: "\\w+"})
  })
  it('should create a boolean schema', () => {
    expectSchema(schema.type('boolean')).to.eql({ type: 'boolean' })
  })
  it('should create a null schema', () => {
    expectSchema(schema.type('null')).to.eql({ type: 'null' })
  })
  it('should create an array schema', () => {
    expectSchema(schema.type('array')).to.eql({ type: 'array' })
    expectSchema(schema.type('array').minItems(3).maxItems(5)).to.eql({ type: 'array', minItems: 3, maxItems: 5 })
    expectSchema(schema.type('array').uniqueItems(true)).to.eql({ type: 'array', uniqueItems: true })
    expectSchema(schema.type('array').items(schema.type('string'))).to.eql({ type: 'array', items: { type: 'string' } })
    expectSchema(schema.type('array').items(schema.type('string'))).to.eql({ type: 'array', items: { type: 'string' } })
    expectSchema(schema.type('array').items([schema.type('string')])).to.eql({ type: 'array', items: [{ type: 'string' }] })
    expectSchema(schema.type('array').items([
      schema.type('string'),
      schema.type('array').items(schema.type('number')),
      schema.type('number')
    ])).to.eql({ type: 'array', items: [
      { type: 'string' },
      { type: 'array', items: { type: 'number' } },
      { type: 'number' }
    ]})
    expectSchema(schema.type('array').items([
      schema.type('string'),
      schema.type('array').items(schema.type('number')),
      schema.type('number')
    ]).additionalItems(true)).to.eql({ type: 'array', items: [
      { type: 'string' },
      { type: 'array', items: { type: 'number' } },
      { type: 'number' }
    ], additionalItems: true})
    expectSchema(schema.type('array').items([
      schema.type('string'),
      schema.type('array').items(schema.type('number')),
      schema.type('number')
    ]).additionalItems(schema.type('boolean'))).to.eql({ type: 'array', items: [
      { type: 'string' },
      { type: 'array', items: { type: 'number' } },
      { type: 'number' }
    ], additionalItems: { type: 'boolean' }})

    expectSchema(schema.type('array').items(schema.type('string')).contains(schema.type('null'))).to.eql({
      type: 'array', items: {type: 'string'}, contains: { type: 'null' }})
  })

  it('should create an object schema', () => {
    expectSchema(schema.type('object')).to.eql({ type: 'object' })
    expectSchema(schema.type('object').maxProperties(3).minProperties(1)).to.eql({
      type: 'object',
      maxProperties: 3,
      minProperties: 1
    })

    const schemaWithProperties = schema.type('object').properties({
      a: schema.type('string'),
      b: schema.type('array').items(schema.type('number'))
    })

    expectSchema(schemaWithProperties).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'array', items: { type: 'number' }}
      }
    })
    
    const schemaWithRequiredProperties = schema.type('object')
      .properties({
        a: schema.type('string'),
        b: schema.type('array').items(schema.type('number'))
      })
      .required('a', 'b', 'c')

    expectSchema(schemaWithRequiredProperties).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'array', items: { type: 'number' }}
      },
      required: ['a', 'b', 'c']
    })
    
    const schemaWithNoAdditionalProperties = schema.type('object')
      .properties({
        a: schema.type('string'),
        b: schema.type('array').items(schema.type('number'))
      })
      .required('a', 'b', 'c')
      .additionalProperties(false)

    expectSchema(schemaWithNoAdditionalProperties).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'array', items: { type: 'number' }}
      },
      required: ['a', 'b', 'c'],
      additionalProperties: false
    })

    const objectWithPatternProperties = schema.type('object')
      .properties({
        a: schema.type('string')
      })
      .additionalProperties(false)
      .patternProperties({
        "$foo^": schema.type('string')
      })

    expectSchema(objectWithPatternProperties).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
      },
      additionalProperties: false,
      patternProperties: {
        "$foo^": { type: 'string' }
      }
    })
    
    const objectWithDependencies = schema.type('object')
      .additionalProperties(false)
      .dependencies({
        a: schema.type('string'),
        b: ['c', 'd']
      })

    expectSchema(objectWithDependencies).to.eql({
      type: 'object',
      additionalProperties: false,
      dependencies: {
        a: {type: 'string'},
        b: ['c', 'd']
      }
    })
  })

  it('should create a schema with multiple types (as an array)')

  it('should allow metadata values', () => {
    expectSchema(schema.title('someTitle').description('foo')).to.eql({ title: 'someTitle', description: 'foo' })
  })
  
  it('should allow default values', () => {
    expectSchema(schema.type('string').default('asdf')).to.eql({ type: 'string', default: 'asdf' })
  })
  
  it('should allow enumerated values', () => {
    const enumSchema = schema.enum([[4, 5], '3', false, null])
    expectSchema(enumSchema).to.eql({ enum: [ [4, 5], '3', false, null] })

    const enumWithType = schema.type('string').enum(['5', null])
    expectSchema(enumWithType).to.eql({ type: 'string', enum: [ '5', null] })
  })

  it('should combine schemas using allOf', () => {
    const s = schema.allOf(
      schema.type('array').items(schema.type('string')),
      schema.type('number')
    )

    expectSchema(s).to.eql({ 
      allOf: [
        { type: 'array', items: { type: 'string'} },
        { type: 'number' }
      ]
    })
  })

  it('should combine schemas using anyOf', () => {
    const s = schema.anyOf(
      schema.type('string'),
      schema.type('number'),
      schema.type('object').properties({ a: schema.type('string') })
    )

    expectSchema(s).to.eql({ 
      anyOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'object', properties: { a: { type: 'string' }} }
      ]
    })
  })

  it('should combine schemas using oneOf', () => {
    const s = schema.oneOf(
      schema.type('string'),
      schema.type('number'),
      schema.type('object').properties({ a: schema.type('string') })
    )

    expectSchema(s).to.eql({ 
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'object', properties: { a: { type: 'string' }} }
      ]
    })
  })

  it('should combine schemas using not', () => {
    const s = schema.type('string').not(schema.enum(['fizz']))

    expectSchema(s).to.eql({ 
      not: [
        { type: 'string' }
      ]
    })
  })
})
