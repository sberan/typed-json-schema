import { is, Schema, Validator } from '../src'
import gen from '../src/generate'
import { AnyJson } from '../src/json'
const { expect } = require('chai')

function expectGen(input: () => Schema<any>, json: AnyJson) {
  const expected = input()
  expect(expected.toJSON()).to.eql(json)
  const expectedGenText = input.toString()
  const beginGen = expectedGenText.indexOf('.is(')
  const endGen = expectedGenText.indexOf(';')
  const expectedGen = expectedGenText
    .substring(beginGen + 1, endGen)
    .replace(/\w+\.is\(/g, 'is(')
    .replace(/\n\s*\./g, '.')
    .replace(/\n\s*/g, ' ')
  expect(expectedGen).to.eql(gen(JSON.stringify(json)))
  return expected._T
}

describe('JSON schema', () => {
  describe('number', () => {
    it('should create a number schema', () => {
      const numberSchema = () =>
       is('number')

      expectGen(numberSchema, {
        type: 'number'
      })
    })

    it('should allow min/max', () => {
      const numberMinMax = () =>
       is('number').maximum(4).minimum(3)

      expectGen(numberMinMax, {
        type: 'number',
        maximum: 4,
        minimum: 3
      })
    })

    it('should allow exclusive maximum', () => {
      const numberWithExclusives = () =>
       is('number').exclusiveMaximum(4).exclusiveMinimum(2)

      expectGen(numberWithExclusives, {
        type: 'number',
        exclusiveMaximum: 4,
        exclusiveMinimum: 2
      })
    })

    it('should allow exclusive min/max as booleans', () => {
      const complexNumber = () =>
       is('number')
        .maximum(4)
        .minimum(3)
        .exclusiveMaximum(true)
        .exclusiveMinimum(true)

      expectGen(complexNumber, {
        type: 'number',
        maximum: 4,
        minimum: 3,
        exclusiveMaximum: true,
        exclusiveMinimum: true
      })
    })

    it('should support multipleOf', () => {
      const numberWithMultiple = () =>
       is('number').multipleOf(3)

      expectGen(numberWithMultiple, {
        type: 'number',
        multipleOf: 3
      })
    })

    it('should allow integer type', () => {
      const integerSchema = () =>
       is('integer')

      expectGen(integerSchema, {
        type: 'integer'
      })
    })
  })

  describe('string', () => {
    it('should create a string schema', () => {
      const stringSchema = () =>
       is('string')

      expectGen(stringSchema, {
        type: 'string'
      })
    })

    it('should support min/max lengths', () => {
      const stringLengths = () =>
       is('string').minLength(3).maxLength(5)

      expectGen(stringLengths, {
        type: 'string',
        minLength: 3,
        maxLength: 5
      })
    })

    it('should support pattern regexes', () => {
      const stringPattern = () =>
       is('string').pattern(/\w+/)

      expectGen(stringPattern, {
        type: 'string',
        pattern: '\\w+'
      })
    })

    it('should support format strings', () => {
      const stringFormat = () =>
       is('string').format('email')

      expectGen(stringFormat, {
        type: 'string',
        format: 'email'
      })
    })
  })

  it('should create a boolean schema', () => {
    const booleanSchema = () =>
     is('boolean')

    expectGen(booleanSchema, {
      type: 'boolean'
    })
  })

  it('should create a null schema', () => {
    const nullSchema = () =>
     is('null')

    expectGen(nullSchema, {
      type: 'null'
    })
  })

  describe('array schema', () => {
    it('should create a basic schema', () => {
      const arraySchema = () =>
       is('array')

      expectGen(arraySchema, {
        type: 'array'
      })
    })

    it('should allow item counts', () => {
      const minMaxArray = () =>
       is('array').minItems(3).maxItems(5)

      expectGen(minMaxArray, {
        type: 'array',
        minItems: 3,
        maxItems: 5
      })
    })

    it('should allow unique items', () => {
      const uniqueItems = () =>
       is('array').uniqueItems(true)

      expectGen(uniqueItems, {
        type: 'array',
        uniqueItems: true
      })
    })

    it('should allow items type', () => {
      const arrayOfStrings = () =>
       is('array').items('string')

      expectGen(arrayOfStrings, {
        type: 'array',
        items: { type: 'string' }
      })
    })

    it('should build a tuple', () => {
      const stringTuple = () =>
       is('array').items('string', 'number')

      expectGen(stringTuple, {
        type: 'array',
        items: [{ type: 'string' }, { type: 'number' }]
      })
    })

    it('should build a tuple with complex item types', () => {
      const complexTuple = () =>
       is('array').items('string', is('array').items('number'), 'number')

      expectGen(complexTuple, {
        type: 'array',
        items: [
          { type: 'string' },
          { type: 'array', items: { type: 'number' } },
          { type: 'number' }
        ]
      })
    })

    it('should build a tuple with additional items (boolean)', () => {
      const tupleWithAdditionalItems = () =>
       is('array').items('string', is('array').items('number'), 'number').additionalItems(true)

      expectGen(tupleWithAdditionalItems, {
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
      const tupleWithBooleanAdditionalItems = () =>
       is('array').items(
          'string',
          is('array').items('number'),
          'number'
        )
        .additionalItems('boolean')

      expectGen(tupleWithBooleanAdditionalItems, {
        type: 'array', items: [
          { type: 'string' },
          { type: 'array', items: { type: 'number' } },
          { type: 'number' }
        ],
        additionalItems: { type: 'boolean' }
      })
    })

    it('should allow array contains', () => {
      const arrayContains = () =>
       is('array').items('string').contains('null')

      expectGen(arrayContains, {
        type: 'array',
        items: { type: 'string' },
        contains: { type: 'null' }
      })
    })
  })

  describe('object', () => {
    it('should create an object schema', () => {
      const objectSchema = () =>
      is('object')

      expectGen(objectSchema, {
        type: 'object'
      })
    })

    it('should support min/max properties', () => {
      const minMaxProperties = () =>
      is('object').maxProperties(3).minProperties(1)

      expectGen(minMaxProperties, {
        type: 'object',
        maxProperties: 3,
        minProperties: 1
      })
    })

    it('should support properties', () => {
      const schemaWithProperties = () =>
      is('object').properties({
        a: 'string',
        b: is('array').items('number')
      })

      expectGen(schemaWithProperties, {
        type: 'object',
        properties: {
          a: { type: 'string' },
          b: { type: 'array', items: { type: 'number' }}
        }
      })
    })

    it('should support required properties', () => {
      const schemaWithRequiredProperties = () =>
      is('object').properties({
          a: 'string',
          b: is('array').items('number')
        })
        .required('a', 'b', 'c')

      expectGen(schemaWithRequiredProperties, {
        type: 'object',
        properties: {
          a: { type: 'string' },
          b: { type: 'array', items: { type: 'number' }}
        },
        required: ['a', 'b', 'c']
      })
    })

    it('can disallow additional properties', () => {
      const schemaWithNoAdditionalProperties = () =>
        is('object').properties({
          a: 'string',
          b: is('array').items('number'),
          d: 'boolean'
        })
        .required('a', 'b', 'c')
        .additionalProperties(false)

      expectGen(schemaWithNoAdditionalProperties, {
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
      const schemaWithAdditionalProperties = () =>
      is('object')
        .properties({ a: 'string' })
        .required('b')
        .additionalProperties('number')

      expectGen(schemaWithAdditionalProperties, {
        type: 'object',
        properties: {
          a: { type: 'string' }
        },
        required: ['b'],
        additionalProperties: { type: 'number' }
      })
    })

    it('should support pattern properties', () => {
      const objectWithPatternProperties = () =>
      is('object').patternProperties({
        '^foo$': 'string',
        '^bar$': 'number'
      })
      .additionalProperties(false)

      expectGen(objectWithPatternProperties, {
        type: 'object',
        patternProperties: {
          '^foo$': { type: 'string' },
          '^bar$': { type: 'number' }
        },
        additionalProperties: false
      })
    })

    it('should support required along with pattern properties', () => {
      const objectWithRequiredPatternProperties = () =>
      is('object').patternProperties({
          '^foo$': 'string',
          '^bar$': 'number'
        })
        .required('a')
        .additionalProperties(false)

      expectGen(objectWithRequiredPatternProperties, {
        type: 'object',
        patternProperties: {
          '^foo$': { type: 'string' },
          '^bar$': { type: 'number' }
        },
        required: ['a'],
        additionalProperties: false
      })
    })

    it('should support dependencies', () => {
      const objectWithDependencies = () =>
      is('object').additionalProperties(false)
        .dependencies({
          a: 'string',
          b: ['c', 'd']
        })

      expectGen(objectWithDependencies, {
        type: 'object',
        additionalProperties: false,
        dependencies: {
          a: { type: 'string' },
          b: ['c', 'd']
        }
      })
    })

    it('should create a strict object', () => {
      const strictObject = () => is('object', { a: 'string', b: is('array').items('number') })

      expectGen(strictObject, {
        type: 'object',
        properties: {
          a: { type: 'string' },
          b: {
            type: 'array',
            items: { type: 'number' }
          }
        },
        additionalProperties: false,
        required: ['a','b']
      })
    })
  })

  it('should create a schema with multiple types (as an array)', () => {
    const schemaWithMultipleTypes = () =>
     is('string', 'null')

    expectGen(schemaWithMultipleTypes, {
      type: ['string', 'null']
    })
  })

  it('should allow any combination of keywords from different types', () => {
    const crazySchema = () =>
     is('number', 'boolean')
      .properties({a: 'string'})
      .maxLength(42)

    expectGen(crazySchema, {
      type: ['number', 'boolean'],
      properties: { a: { type: 'string' } },
      maxLength: 42
    })
  })

  it('should allow metadata values', () => {
    const schemaWithMetadata = () =>
     is().title('someTitle').description('foo')

    expectGen(schemaWithMetadata, {
      title: 'someTitle',
      description: 'foo'
    })
  })

  it('should allow default values', () => {
    const schemaWithDefault = () =>
     is('string').default('asdf')

    expectGen(schemaWithDefault, {
      type: 'string',
      default: 'asdf'
    })
  })

  it('should allow examples', () => {
    const schemaWithDefault = () =>
     is('string').example('fizz')

    expectGen(schemaWithDefault, {
      type: 'string',
      example: 'fizz'
    })
  })

  it('should allow enumerated values', () => {
    const enumSchema = () =>
     is().enum([4, 5], '3', false, null)

    expectGen(enumSchema, {
      enum: [ [4, 5], '3', false, null]
    })

    const enumWithType = () =>
     is('string').enum('5', null)

    expectGen(enumWithType, {
      type: 'string',
      enum: [ '5', null ]
    })
  })

  it('should allow const values', () => {
    const constSchema = () =>
     is().const('\'')

    expectGen(constSchema, {
      const: '\''
    })
  })

  it('should combine schemas using allOf', () => {
    const s = () =>
     is().allOf(
      is('array').items('string'),
      'number'
    )

    expectGen(s, {
      allOf: [
        { type: 'array', items: { type: 'string'} },
        { type: 'number' }
      ]
    })
  })

  it('should combine schemas using anyOf', () => {
    const s = () =>
     is().anyOf(
      'string',
      'number',
      is('object').properties({ a: 'string' }).required('a')
    )

    expectGen(s, {
      anyOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'object', properties: { a: { type: 'string' }}, required: ['a'] }
      ]
    })
  })

  it('should combine schemas using oneOf', () => {
    const s = () =>
     is().oneOf(
      'string',
      'number',
      is('array').items('string')
    )

    expectGen(s, {
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'array', items: { type: 'string' } }
      ]
    })
  })

  it('should combine schemas using not', () => {
    const s = () =>
     is('string').not(is().enum('fizz'))

    expectGen(s, {
      type: 'string',
      not: {
        enum: ['fizz']
      }
    })
  })

  it('should support multiple top level types',  () => {
    const s = () => is('string', 'number')

    expectGen(s, { type: ['string', 'number']})
  })

  it('should check a schema', () => {
    expect(is('number').check(4)).to.eql(true)
    expect(is('string').check(4)).to.eql(false)
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
