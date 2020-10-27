import { expect } from 'chai'
import { is, Validator } from '../src'

describe('JSON schema', () => {
  describe('number', () => {
    it('should create a number schema', () => {
      const numberSchema = is('number')

      expect(numberSchema.toJSON()).to.eql({
        type: 'number'
      })
    })

    it('should allow min/max', () => {
      const numberMinMax = is('number').maximum(4).minimum(3)

      expect(numberMinMax.toJSON()).to.eql({
        type: 'number',
        maximum: 4,
        minimum: 3
      })
    })

    it('should allow exclusive maximum', () => {
      const numberWithExclusives = is('number').exclusiveMaximum(4).exclusiveMinimum(2)

      expect(numberWithExclusives.toJSON()).to.eql({
        type: 'number',
        exclusiveMaximum: 4,
        exclusiveMinimum: 2
      })
    })

    it('should allow exclusive min/max as booleans', () => {
      const complexNumber = is('number')
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
    })

    it('should support multipleOf', () => {
      const numberWithMultiple = is('number').multipleOf(3)

      expect(numberWithMultiple.toJSON()).to.eql({
        type: 'number',
        multipleOf: 3
      })
    })

    it('should allow integer type', () => {
      const integerSchema = is('integer')

      expect(integerSchema.toJSON()).to.eql({
        type: 'integer'
      })
    })
  })

  describe('string', () => {
    it('should create a string schema', () => {
      const stringSchema = is('string')

      expect(stringSchema.toJSON()).to.eql({
        type: 'string'
      })
    })

    it('should support min/max lengths', () => {
      const stringLengths = is('string').minLength(3).maxLength(5)

      expect(stringLengths.toJSON()).to.eql({
        type: 'string',
        minLength: 3,
        maxLength: 5
      })
    })

    it('should support pattern regexes', () => {
      const stringPattern = is('string').pattern(/\w+/)

      expect(stringPattern.toJSON()).to.eql({
        type: 'string',
        pattern: '\\w+'
      })
    })

    it('should support format strings', () => {
      const stringFormat = is('string').format('email')

      expect(stringFormat.toJSON()).to.eql({
        type: 'string',
        format: 'email'
      })
    })
  })

  it('should create a boolean schema', () => {
    const booleanSchema = is('boolean')

    expect(booleanSchema.toJSON()).to.eql({
      type: 'boolean'
    })
  })

  it('should create a null schema', () => {
    const nullSchema = is('null')

    expect(nullSchema.toJSON()).to.eql({
      type: 'null'
    })
  })

  describe('array schema', () => {
    it('should create a basic schema', () => {
      const arraySchema = is('array')

      expect(arraySchema.toJSON()).to.eql({
        type: 'array'
      })
    })

    it('should allow item counts', () => {
      const minMaxArray = is('array').minItems(3).maxItems(5)

      expect(minMaxArray.toJSON()).to.eql({
        type: 'array',
        minItems: 3,
        maxItems: 5
      })
    })

    it('should allow unique items', () => {
      const uniqueItems = is('array').uniqueItems(true)

      expect(uniqueItems.toJSON()).to.eql({
        type: 'array',
        uniqueItems: true
      })
    })

    it('should allow items type', () => {
      const arrayOfStrings = is('array').items('string')

      expect(arrayOfStrings.toJSON()).to.eql({
        type: 'array',
        items: { type: 'string' }
      })
    })

    it('should build a tuple', () => {
      const stringTuple = is('array').items('string', 'number')

      expect(stringTuple.toJSON()).to.eql({
        type: 'array',
        items: [{ type: 'string' }, { type: 'number' }]
      })
    })

    it('should build a tuple with complex item types', () => {
      const complexTuple = is('array').items('string', is('array').items('number'), 'number')

      expect(complexTuple.toJSON()).to.eql({
        type: 'array',
        items: [
          { type: 'string' },
          { type: 'array', items: { type: 'number' } },
          { type: 'number' }
        ]
      })
    })

    it('should build a tuple with additional items (boolean)', () => {
      const tupleWithAdditionalItems = is('array').items('string', is('array').items('number'), 'number').additionalItems(true)

      expect(tupleWithAdditionalItems.toJSON()).to.eql({
        type: 'array',
        items: [
          { type: 'string' },
          { type: 'array', items: { type: 'number' } },
          { type: 'number' }
        ],
        additionalItems: true
      })
    })

    it('should build a tuple with additional items (schema)', () => {
      const tupleWithBooleanAdditionalItems = is('array').items(
          'string',
          is('array').items('number'),
          'number'
        )
        .additionalItems('boolean')

      expect(tupleWithBooleanAdditionalItems.toJSON()).to.eql({
        type: 'array', items: [
          { type: 'string' },
          { type: 'array', items: { type: 'number' } },
          { type: 'number' }
        ],
        additionalItems: { type: 'boolean' }
      })
    })

    it('should allow array contains', () => {
      const arrayContains = is('array').items('string').contains('null')

      expect(arrayContains.toJSON()).to.eql({
        type: 'array',
        items: { type: 'string' },
        contains: { type: 'null' }
      })
    })
  })

  it('should create an object schema', () => {
    const objectSchema = is('object')

    expect(objectSchema.toJSON()).to.eql({
      type: 'object'
    })
  })

  it('should support min/max properties', () => {
    const minMaxProperties = is('object').maxProperties(3).minProperties(1)

    expect(minMaxProperties.toJSON()).to.eql({
      type: 'object',
      maxProperties: 3,
      minProperties: 1
    })
  })

  it('should support properties', () => {
    const schemaWithProperties = is('object').properties({
      a: 'string',
      b: is('array').items('number')
    })

    expect(schemaWithProperties.toJSON()).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'array', items: { type: 'number' }}
      }
    })
  })

  it('should support required properties', () => {
    const schemaWithRequiredProperties = is('object').properties({
        a: 'string',
        b: is('array').items('number')
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
  })

  it('can disallow additional properties', () => {
    const schemaWithNoAdditionalProperties = is('object').required('a', 'b', 'c').properties({
        a: 'string',
        b: is('array').items('number'),
        d: 'boolean'
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
  })

  it('can specify schema for additional properties type', () => {
    const schemaWithAdditionalProperties = is('object')
      .properties({ a: 'string' })
      .required('b')
      .additionalProperties('number')

    expect(schemaWithAdditionalProperties.toJSON()).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' }
      },
      required: ['b'],
      additionalProperties: { type: 'number' }
    })
  })

  it('should support pattern properties', () => {
    const objectWithPatternProperties = is('object').patternProperties({
      '$foo^': 'string',
      '$bar^': 'number'
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
  })

  it('should support required along with pattern properties', () => {
    const objectWithRequiredPatternProperties = is('object').patternProperties({
        '$foo^': 'string',
        '$bar^': 'number'
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
  })

  it('should support dependencies', () => {
    const objectWithDependencies = is('object').additionalProperties(false)
      .dependencies({
        a: 'string',
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
    const schemaWithMultipleTypes = is('string', 'null')

    expect(schemaWithMultipleTypes.toJSON()).to.eql({
      type: ['string', 'null']
    })
  })

  it('should allow any combination of keywords from different types', () => {
    const crazySchema = is('number', 'boolean')
      .properties({a: 'string'})
      .maxLength(42)

    expect(crazySchema.toJSON()).to.eql({
      type: ['number', 'boolean'],
      properties: { a: { type: 'string' } },
      maxLength: 42
    })
  })

  it('should allow metadata values', () => {
    const schemaWithMetadata = is().title('someTitle').description('foo')

    expect(schemaWithMetadata.toJSON()).to.eql({
      title: 'someTitle',
      description: 'foo'
    })
  })

  it('should allow default values', () => {
    const schemaWithDefault = is('string').default('asdf')

    expect(schemaWithDefault.toJSON()).to.eql({
      type: 'string',
      default: 'asdf'
    })
  })

  it('should allow examples', () => {
    const schemaWithDefault = is('string').example('fizz')

    expect(schemaWithDefault.toJSON()).to.eql({
      type: 'string',
      example: 'fizz'
    })
  })

  it('should allow enumerated values', () => {
    const enumSchema = is().enum([4, 5], '3', false, null)

    expect(enumSchema.toJSON()).to.eql({
      enum: [ [4, 5], '3', false, null]
    })

    const enumWithType = is('string').enum('5', null)

    expect(enumWithType.toJSON()).to.eql({
      type: 'string',
      enum: [ '5', null ]
    })
  })

  it('should allow const values', () => {
    const constSchema = is().const(4)

    expect(constSchema.toJSON()).to.eql({
      const: 4
    })
  })

  it('should combine schemas using allOf', () => {
    const s = is().allOf(
      is('array').items('string'),
      is('number')
    )

    expect(s.toJSON()).to.eql({
      allOf: [
        { type: 'array', items: { type: 'string'} },
        { type: 'number' }
      ]
    })
  })

  it('should combine schemas using anyOf', () => {
    const s = is().anyOf(
      is('string'),
      is('number'),
      is('object').properties({ a: 'string' }).required('a')
    )

    expect(s.toJSON()).to.eql({
      anyOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'object', properties: { a: { type: 'string' }}, required: ['a'] }
      ]
    })
  })

  it('should combine schemas using oneOf', () => {
    const s = is().oneOf(
      is('string'),
      is('number'),
      is('array').items('string')
    )

    expect(s.toJSON()).to.eql({
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'array', items: { type: 'string' } }
      ]
    })
  })

  it('should combine schemas using not', () => {
    const s = is('string').not(is().enum('fizz'))

    expect(s.toJSON()).to.eql({
      type: 'string',
      not: {
        enum: ['fizz']
      }
    })
  })

  it('should validate a schema', async () => {
    const result = await new Validator().validate(is('string'), 'a')

    expect(result).to.eql('a')
  })

  it('should coerce validated data', async () => {
    const result = await new Validator({ coerceTypes: true }).validate(is('string'), 1)

    expect(result).to.eql('1')
  })
})
