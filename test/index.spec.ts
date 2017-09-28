import { expect } from 'chai'
import {
  array,
  boolean,
  integer,
  number,
  object,
  schema,
  string,
  Validator
} from '../src'

describe('JSON schema', () => {
  it('should create a number schema', () => {
    const numberSchema = schema.type('number')

    expect(numberSchema.toJSON()).to.eql({
      type: 'number'
    })

    const numberMinMax = number.maximum(4).minimum(3)

    expect(numberMinMax.toJSON()).to.eql({
      type: 'number',
      maximum: 4,
      minimum: 3
    })

    const numberWithExclusives = number.exclusiveMaximum(4).exclusiveMinimum(2)

    expect(numberWithExclusives.toJSON()).to.eql({
      type: 'number',
      exclusiveMaximum: 4,
      exclusiveMinimum: 2
    })

    const complexNumber = number
      .maximum(4)
      .minimum(3)
      .exclusiveMaximum(true)
      .exclusiveMinimum(true)

    expect(complexNumber.toJSON()).to.eql({
      type: 'number',
      maximum: 4,
      minimum: 3,
      exclusiveMaximum: true,
      exclusiveMinimum: true
    })

    const numberWithMultiple = number.multipleOf(3)

    expect(numberWithMultiple.toJSON()).to.eql({
      type: 'number',
      multipleOf: 3
    })

    const integerSchema = schema.type('integer')

    expect(integerSchema.toJSON()).to.eql({
      type: 'integer'
    })

    expect(integer.toJSON()).to.eql({
      type: 'integer'
    })
  })

  it('should create a string schema', () => {
    const stringSchema = schema.type('string')

    expect(stringSchema.toJSON()).to.eql({
      type: 'string'
    })

    const stringLengths = string.minLength(3).maxLength(5)

    expect(stringLengths.toJSON()).to.eql({
      type: 'string',
      minLength: 3,
      maxLength: 5
    })

    const stringPattern = string.pattern(/\w+/)

    expect(stringPattern.toJSON()).to.eql({
      type: 'string',
      pattern: '\\w+'
    })
    const stringFormat = string.format('email')

    expect(stringFormat.toJSON()).to.eql({
      type: 'string',
      format: 'email'
    })
  })

  it('should create a boolean schema', () => {
    const booleanSchema = schema.type('boolean')

    expect(booleanSchema.toJSON()).to.eql({
      type: 'boolean'
    })
  })
  it('should create a null schema', () => {
    const nullSchema = schema.type('null')

    expect(nullSchema.toJSON()).to.eql({
      type: 'null'
    })
  })

  it('should create an array schema', () => {
    const arraySchema = schema.type('array')

    expect(arraySchema.toJSON()).to.eql({
      type: 'array'
    })

    const minMaxArray = array.minItems(3).maxItems(5)

    expect(minMaxArray.toJSON()).to.eql({
      type: 'array',
      minItems: 3,
      maxItems: 5
    })

    const uniqueItems = array.uniqueItems(true)

    expect(uniqueItems.toJSON()).to.eql({
      type: 'array',
      uniqueItems: true
    })

    const arrayOfStrings = array(string)

    expect(arrayOfStrings.toJSON()).to.eql({
      type: 'array',
      items: { type: 'string' }
    })

    const stringTuple = array([string])

    expect(stringTuple.toJSON()).to.eql({
      type: 'array',
      items: [{ type: 'string' }]
    })

    const complexTuple = array([string, array(number), number])

    expect(complexTuple.toJSON()).to.eql({
      type: 'array',
      items: [
        { type: 'string' },
        { type: 'array', items: { type: 'number' } },
        { type: 'number' }
      ]
    })

    const tupleWithAdditionalItems = array([string, array(number), number]).additionalItems(true)

    expect(tupleWithAdditionalItems.toJSON()).to.eql({
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

    expect(tupleWithBooleanAdditionalItems.toJSON()).to.eql({
      type: 'array', items: [
        { type: 'string' },
        { type: 'array', items: { type: 'number' } },
        { type: 'number' }
      ],
      additionalItems: { type: 'boolean' }
    })

    const arrayContains = array(string)
      .contains(schema.type('null'))

    expect(arrayContains.toJSON()).to.eql({
      type: 'array',
      items: { type: 'string' },
      contains: { type: 'null' }
    })
  })

  it('should create an object schema', () => {
    const objectSchema = schema.type('object')

    expect(objectSchema.toJSON()).to.eql({
      type: 'object'
    })

    const minMaxProperties = object.maxProperties(3).minProperties(1)

    expect(minMaxProperties.toJSON()).to.eql({
      type: 'object',
      maxProperties: 3,
      minProperties: 1
    })

    const schemaWithProperties = object({
      a: string,
      b: array(number)
    })

    expect(schemaWithProperties.toJSON()).to.eql({
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

    expect(schemaWithRequiredProperties.toJSON()).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'array', items: { type: 'number' }}
      },
      required: ['a', 'b', 'c']
    })

    const schemaWithNoAdditionalProperties = object.required('a', 'b', 'c').properties({
        a: string,
        b: array(number),
        d: boolean
      })
      .additionalProperties(false)

    expect(schemaWithNoAdditionalProperties.toJSON()).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'array', items: { type: 'number' }},
        d: { type: 'boolean' }
      },
      required: ['a', 'b', 'c'],
      additionalProperties: false
    })

    const schemaWithAdditionalProperties = object
      .properties({ a: string })
      .required('b')
      .additionalProperties(number)

    expect(schemaWithAdditionalProperties.toJSON()).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' }
      },
      required: ['b'],
      additionalProperties: { type: 'number' }
    })

    const objectWithPatternProperties = object.patternProperties({
      '$foo^': string,
      '$bar^': number
    })
    .additionalProperties(false)

    expect(objectWithPatternProperties.toJSON()).to.eql({
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '$foo^': { type: 'string' },
        '$bar^': { type: 'number' }
      }
    })

    const objectWithRequiredPatternProperties = object.patternProperties({
        '$foo^': string,
        '$bar^': number
      })
      .required('a')
      .additionalProperties(false)

    expect(objectWithRequiredPatternProperties.toJSON()).to.eql({
      type: 'object',
      required: ['a'],
      additionalProperties: false,
      patternProperties: {
        '$foo^': { type: 'string' },
        '$bar^': { type: 'number' }
      }
    })

    const objectWithDependencies = object.additionalProperties(false)
      .dependencies({
        a: string,
        b: ['c', 'd']
      })

    expect(objectWithDependencies.toJSON()).to.eql({
      type: 'object',
      additionalProperties: false,
      dependencies: {
        a: { type: 'string' },
        b: ['c', 'd']
      }
    })
  })

  it('should create a schema with multiple types (as an array)', () => {
    const schemaWithMultipleTypes = schema.type(['string', 'null'])

    expect(schemaWithMultipleTypes.toJSON()).to.eql({
      type: ['string', 'null']
    })
  })

  it('should allow any combination of keywords from different types', () => {
    const crazySchema = schema
      .type(['number', 'boolean'])
      .properties({a: string})
      .maxLength(42)

    expect(crazySchema.toJSON()).to.eql({
      type: ['number', 'boolean'],
      properties: { a: { type: 'string' } },
      maxLength: 42
    })
  })

  it('should allow metadata values', () => {
    const schemaWithMetadata = schema.title('someTitle').description('foo')

    expect(schemaWithMetadata.toJSON()).to.eql({
      title: 'someTitle',
      description: 'foo'
    })
  })

  it('should allow default values', () => {
    const schemaWithDefault = string.default('asdf')

    expect(schemaWithDefault.toJSON()).to.eql({
      type: 'string',
      default: 'asdf'
    })
  })

  it('should allow enumerated values', () => {
    const enumSchema = schema.enum([[4, 5], '3', false, null])

    expect(enumSchema.toJSON()).to.eql({
      enum: [ [4, 5], '3', false, null]
    })

    const enumWithType = string.enum(['5', null])

    expect(enumWithType.toJSON()).to.eql({
      type: 'string',
      enum: [ '5', null ]
    })
  })

  it('should allow const values', () => {
    const constSchema = schema.const(4)

    expect(constSchema.toJSON()).to.eql({
      const: 4
    })
  })

  it('should combine schemas using allOf', () => {
    const s = schema.allOf([
      array(string),
      number
    ])

    expect(s.toJSON()).to.eql({
      allOf: [
        { type: 'array', items: { type: 'string'} },
        { type: 'number' }
      ]
    })
  })

  it('should combine schemas using anyOf', () => {
    const s = schema.anyOf([
      string,
      number,
      object({ a: string }).required('a')
    ])

    expect(s.toJSON()).to.eql({
      anyOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'object', properties: { a: { type: 'string' }}, required: ['a'] }
      ]
    })
  })

  it('should combine schemas using oneOf', () => {
    const s = schema.oneOf([
      string,
      number,
      array(string)
    ])

    expect(s.toJSON()).to.eql({
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'array', items: { type: 'string' } }
      ]
    })
  })

  it('should combine schemas using not', () => {
    const s = string.not(schema.enum(['fizz']))

    expect(s.toJSON()).to.eql({
      type: 'string',
      not: {
        enum: ['fizz']
      }
    })
  })

  it('should validate a schema', async () => {
    const result = await new Validator().validate(schema.anyOf([string]), 'a')

    expect(result).to.eql('a')
  })

  it('should coerce validated data', async () => {
    const result = await new Validator({ coerceTypes: true }).validate(string, 1)

    expect(result).to.eql('1')
  })
})
