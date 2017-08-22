import { expect } from 'chai'
import {
  schema,
  Schema,
  number,
  integer,
  string,
  array,
  boolean,
  object,
  AnyJSON,
  JSONObject,
  JSONPrimitive,
  JSONArray,
  ValidateArgs,
  createValidationDecorator,
  Validator
} from '../src/schema'

function expectSchema <ExpectedType extends AnyJSON> (schema: Schema<ExpectedType>) {
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
  
    expectSchema<AnyJSON[]>(arraySchema).to.eql({
      type: 'array'
    })
  
    const minMaxArray = array.minItems(3).maxItems(5)
  
    expectSchema<AnyJSON[]>(minMaxArray).to.eql({
      type: 'array',
      minItems: 3,
      maxItems: 5
    })
  
    const uniqueItems = array.uniqueItems(true)
  
    expectSchema<AnyJSON[]>(uniqueItems).to.eql({
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

    expectSchema<AnyJSON[]>(tupleWithAdditionalItems).to.eql({
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
    
    const schemaWithNoAdditionalProperties = object.required('a', 'b', 'c').properties({
        a: string,
        b: array(number)
      })
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
      .patternProperties({
        "$foo^": string,
        "$bar^": number
      })
      .additionalProperties(false)
      

    expectSchema(objectWithPatternProperties).to.eql({
      type: 'object',
      properties: {
        a: { type: 'string' },
      },
      additionalProperties: false,
      patternProperties: {
        "$foo^": { type: 'string' },
        "$bar^": { type: 'number' }
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
  
    expectSchema<false | "3" | (4 | 5)[] | null>(enumSchema).to.eql({
      enum: [ [4, 5], '3', false, null]
    })

    const enumWithType = string.enum(['5', null])

    expectSchema<"5" | null>(enumWithType).to.eql({
      type: 'string',
      enum: [ '5', null ]
    })
  })

  it('should combine schemas using allOf', () => {
    const s = schema.allOf(
      array(string),
      number
    )

    expectSchema<string[] | number>(s).to.eql({ 
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
      object({ a: string }).required('a')
    )

    expectSchema<string | number | { a: string }>(s).to.eql({ 
      anyOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'object', properties: { a: { type: 'string' }}, required: ['a'] }
      ]
    })
  })

  it('should combine schemas using oneOf', () => {
    const s = schema.oneOf(
      string,
      number,
      array(string)
    )

    expectSchema<string | number | string[]>(s).to.eql({ 
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'array', items:{ type: 'string' } }
      ]
    })
  })

  it('should combine schemas using not', () => {
    const s = string.not(schema.enum(['fizz']))

    expectSchema<string>(s).to.eql({ 
      type: 'string',
      not: { 
        enum: ['fizz']
      }
    })
  })

  it('should validate a schema', () => {
    const { errors, result } = new Validator().validate(schema.anyOf(string), 'a')

    expect(errors).to.not.exist
    expect(result).to.eql('a')
  })

  it('should coerce validated data', () => {
    const { errors, result } = new Validator({ coerceTypes: true }).validate(string, 1)

    expect(errors).to.not.exist
    expect(result).to.eql('1')
  })

  it('should validate function args', () => {
    const StringOrNumber = schema.anyOf(string, number)
    type StringOrNumber = schema<typeof StringOrNumber>

    const StringOrNull = schema.anyOf(string, schema.type('null'))
    type StringOrNull = schema<typeof StringOrNull>
    
    class Foo {
      @ValidateArgs() stringOrNumber(arg: StringOrNumber) {
        if (typeof arg === 'string') {
          return arg.toUpperCase()
        } else {
          return arg + 1
        }
      }

      @ValidateArgs() multiArgs(arg1: StringOrNumber, arg2: StringOrNull, arg3: StringOrNumber) {
        return '' + arg1 + ' ' + arg2
      }

      @ValidateArgs() simpleArgs(arg1: string, arg2: StringOrNumber, arg3: number, arg4: boolean) {
        return '' + arg1 + ' ' + arg2 + ' ' + arg3 + ' ' + arg4
      }
    }
    const foo = new Foo()
    expect(foo.stringOrNumber('str')).to.eql('STR')
    expect(foo.stringOrNumber(42)).to.eql(43)
    expect(() => foo.stringOrNumber(true as any)).to.throw(TypeError, 
     `invalid invocation of Foo.stringOrNumber:
       argument 0: value \`true\` did not match schema {"anyOf":[{"type":"string"},{"type":"number"}]}`)

    expect(foo.multiArgs(42, null, 52)).to.eql('42 null')
    expect(() => foo.multiArgs([] as any, null, {} as any)).to.throw(
     `invalid invocation of Foo.multiArgs:
       argument 0: value \`[]\` did not match schema {"anyOf":[{"type":"string"},{"type":"number"}]}
       argument 2: value \`{}\` did not match schema {"anyOf":[{"type":"string"},{"type":"number"}]}`)

    expect(foo.simpleArgs('a', '33', 32, true)).to.eql('a 33 32 true')
    expect(() => foo.simpleArgs(32 as any, 33, 'a' as any, 'false' as any)).to.throw(
     `invalid invocation of Foo.simpleArgs:
       argument 0: value \`32\` did not match schema {"type":"string"}
       argument 2: value \`"a"\` did not match schema {"type":"number"}
       argument 3: value \`"false"\` did not match schema {"type":"boolean"}`)
  })

  it('should allow options to be specified in validation annotation', () => {
    class Foo {
      @ValidateArgs({ coerceTypes: true }) coerceTypes(arg: string) {
        return arg
      }

      @ValidateArgs() noCoerceTypes(arg: string) {
        return arg
      }
    }

    expect(new Foo().coerceTypes(42 as any)).to.eql('42')
    expect(() => new Foo().coerceTypes({} as any)).to.throw(TypeError,
      `invalid invocation of Foo.coerceTypes:
       argument 0: value \`{}\` did not match schema {"type":"string"}`)
    expect(() => new Foo().noCoerceTypes(42 as any)).to.throw(TypeError,
      `invalid invocation of Foo.noCoerceTypes:
       argument 0: value \`42\` did not match schema {"type":"string"}`)
  })

  describe.skip('custom validation annotations', () => {
    const someDecorator = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
      descriptor.value = () => 'nope'
    }

    const someValidatingDecorator = createValidationDecorator(someDecorator)
    const someCoercingDecorator = createValidationDecorator(someDecorator, {coerceTypes: true})

    class Foo {
      @someValidatingDecorator validateMethod(arg1: number) {
        throw new Error('implementation overriden by decorator')
      }
      @someCoercingDecorator coerceMethod(arg1: number) {
        throw new Error('implementation overriden by decorator')
      }
    }

    it('should allow custom decorators', () => {
      expect(new Foo().validateMethod(2)).to.eql('nope')
      expect(() => new Foo().validateMethod('3' as any)).to.throw(TypeError,
      `invalid invocation of Foo.validateMethod:
       argument 0: value \`"3"\` did not match schema {"type":"number"}`)
    })

    it('should allow custom decorators to have options', () => {
      expect(new Foo().coerceMethod(2)).to.eql('nope')
      expect(new Foo().coerceMethod('2' as any)).to.eql('nope')
      expect(() => new Foo().coerceMethod({} as any)).to.throw(TypeError,
      `invalid invocation of Foo.coerceMethod:
       argument 0: value \`{}\` did not match schema {"type":"number"}`)
    })
  })
})
