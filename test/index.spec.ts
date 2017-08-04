import { expect } from 'chai'
import { schema, Schema, number, integer, string, array, boolean, object, AnyJSON } from '../src/schema'

function expectSchema <ExpectedType> (schema: Schema<ExpectedType>) {
  return expect(schema.toJSON())
}

describe('JSON schema', () => {
  it('should create a number schema', () => {
    const numberSchema = schema.type('number')
    
    expectSchema<number>(numberSchema).to.eql({
      type: 'number'
    })

    const numberMinMax = number.maximum(4).minimum(3)

    expectSchema<number>(numberMinMax).to.eql({
      type: 'number',
      maximum: 4,
      minimum: 3
    })
    
    const numberWithExclusives = number.exclusiveMaximum(4).exclusiveMinimum(2)
    
    expectSchema<number>(numberWithExclusives).to.eql({
      type: 'number',
      exclusiveMaximum: 4,
      exclusiveMinimum: 2
    })

    const complexNumber = number
      .maximum(4)
      .minimum(3)
      .exclusiveMaximum(true)
      .exclusiveMinimum(true)

    expectSchema<number>(complexNumber).to.eql({
      type: 'number',
      maximum: 4,
      minimum: 3,
      exclusiveMaximum: true,
      exclusiveMinimum: true
    })

    const numberWithMultiple = number.multipleOf(3)
  
    expectSchema<number>(numberWithMultiple).to.eql({
      type: 'number',
      multipleOf: 3
    })

    const integerSchema = schema.type('integer')

    expectSchema<number>(integerSchema).to.eql({
      type: 'integer'
    })
  
    expectSchema<number>(integer).to.eql({
      type: 'integer'
    })
  })

  it('should create a string schema', () => {
    const stringSchema = schema.type('string')
  
    expectSchema<string>(stringSchema).to.eql({
      type: 'string'
    })
  
    const stringLengths = string.minLength(3).maxLength(5)
  
    expectSchema<string>(stringLengths).to.eql({
      type: 'string',
      minLength: 3,
      maxLength: 5
    })

    const stringPattern = string.pattern(/\w+/)
  
    expectSchema<string>(stringPattern).to.eql({
      type: 'string', 
      pattern: "\\w+"
    })
  })

  it('should create a boolean schema', () => {
    const booleanSchema = schema.type('boolean')
  
    expectSchema<boolean>(booleanSchema).to.eql({
      type: 'boolean'
    })
  })
  it('should create a null schema', () => {
    const nullSchema = schema.type('null')
  
    expectSchema<null>(nullSchema).to.eql({
      type: 'null'
    })
  })

  it('should create an array schema', () => {
    const arraySchema = schema.type('array')
  
    expectSchema<any[]>(arraySchema).to.eql({
      type: 'array'
    })
  
    const minMaxArray = array.minItems(3).maxItems(5)
  
    expectSchema<any[]>(minMaxArray).to.eql({
      type: 'array',
      minItems: 3,
      maxItems: 5
    })
  
    const uniqueItems = array.uniqueItems(true)
  
    expectSchema<any[]>(uniqueItems).to.eql({
      type: 'array',
      uniqueItems: true
    })

    const arrayOfStrings = array(string)

    expectSchema<string[]>(arrayOfStrings).to.eql({
      type: 'array',
      items: { type: 'string' }
    })
  
    const stringTuple = array([string])

    expectSchema<[string]>(stringTuple).to.eql({
      type: 'array',
      items: [{ type: 'string' }]
    })

    const complexTuple = array([string, array(number), number])
  
    expectSchema<[string, number[], number]>(complexTuple).to.eql({
      type: 'array',
      items: [
        { type: 'string' },
        { type: 'array', items: { type: 'number' } },
        { type: 'number' }
      ]
    })
  
    const tupleWithAdditionalItems = array([string, array(number), number]).additionalItems(true)

    expectSchema<any[]>(tupleWithAdditionalItems).to.eql({
      type: 'array',
      items: [
        { type: 'string' },
        { type: 'array', items: { type: 'number' } },
        { type: 'number' }
      ],
      additionalItems: true
    })

    const tupleWithBooleanAdditionalItems = array([
        string,
        array(number),
        number
      ])
      .additionalItems(boolean)

    expectSchema<(string | number[] | number | boolean)[]>(tupleWithBooleanAdditionalItems).to.eql({
      type: 'array', items: [
        { type: 'string' },
        { type: 'array', items: { type: 'number' } },
        { type: 'number' }
      ],
      additionalItems: { type: 'boolean' }
    })

    const arrayContains = array(string)
      .contains(schema.type('null'))

    expectSchema<string[]>(arrayContains).to.eql({
      type: 'array',
      items: { type: 'string' },
      contains: { type: 'null' }
    })
  })

  it('should create an object schema', () => {
    const objectSchema = schema.type('object')
  
    expectSchema<{}>(objectSchema).to.eql({
      type: 'object'
    })
  
    const minMaxProperties = object.maxProperties(3).minProperties(1)

    expectSchema<{}>(minMaxProperties).to.eql({
      type: 'object',
      maxProperties: 3,
      minProperties: 1
    })

    const schemaWithProperties = object({
        a: string,
        b: array(number)
      })

    expectSchema<{ a?: string, b?: number[] }>(schemaWithProperties).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'array', items: { type: 'number' }}
      }
    })
    
    const schemaWithRequiredProperties = object({
        a: string,
        b: array(number)
      })
      .required('a', 'b', 'c')

    expectSchema<{ a: string, b: number[], c: AnyJSON, someOtherProperty?: string }>(schemaWithRequiredProperties).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'array', items: { type: 'number' }}
      },
      required: ['a', 'b', 'c']
    })
    
    const schemaWithNoAdditionalProperties = object({
        a: string,
        b: array(number)
      })
      .required('a', 'b', 'c')
      .additionalProperties(false)

    expectSchema<{ a: string, b: number[], c: AnyJSON }>(schemaWithNoAdditionalProperties).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'array', items: { type: 'number' }}
      },
      required: ['a', 'b', 'c'],
      additionalProperties: false
    })

    const objectWithPatternProperties = object({
        a: string
      })
      .additionalProperties(false)
      .patternProperties({
        "$foo^": string
      })

    expectSchema<{f?: number}>(objectWithPatternProperties).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
      },
      additionalProperties: false,
      patternProperties: {
        "$foo^": { type: 'string' }
      }
    })
    
    const objectWithDependencies = object.additionalProperties(false)
      .dependencies({
        a: string,
        b: ['c', 'd']
      })

    expectSchema(objectWithDependencies).to.eql({
      type: 'object',
      additionalProperties: false,
      dependencies: {
        a: { type: 'string' },
        b: ['c', 'd']
      }
    })
  })

  it('should create a schema with multiple types (as an array)')
  it('should allow any combination of keywords from different types')

  it('should allow metadata values', () => {
    const schemaWithMetadata = schema.title('someTitle').description('foo')

    expectSchema(schemaWithMetadata).to.eql({
      title: 'someTitle',
      description: 'foo'
    })
  })
  
  it('should allow default values', () => {
    const schemaWithDefault = string.default('asdf')

    expectSchema(schemaWithDefault).to.eql({
      type: 'string',
      default: 'asdf'
    })
  })
  
  it('should allow enumerated values', () => {
    const enumSchema = schema.enum([[4, 5], '3', false, null])
  
    expectSchema(enumSchema).to.eql({
      enum: [ [4, 5], '3', false, null]
    })

    const enumWithType = string.enum(['5', null])

    expectSchema(enumWithType).to.eql({
      type: 'string',
      enum: [ '5', null ]
    })
  })

  it('should combine schemas using allOf', () => {
    const s = schema.allOf(
      array(string),
      number
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
      string,
      number,
      object({ a: string })
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
      string,
      number,
      object({ a: string })
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
    const s = string.not(schema.enum(['fizz']))

    expectSchema(s).to.eql({ 
      type: 'string',
      not: { 
        enum: ['fizz']
      }
    })
  })

  it('should validate a schema', () => {
    const { errors, result } = schema.anyOf(string).validate('a')

    expect(errors).to.not.exist
    expect(result).to.eql('a')
  })

  it('should coerce validated data', () => {
    const { errors, result } = string.validate(1, { coerceTypes: true })

    expect(errors).to.not.exist
    expect(result).to.eql('1')
  })
})
