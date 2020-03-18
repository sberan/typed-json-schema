import { schema, Struct } from ".."
import { reflectAnnotations, createAnnotationFactory } from "reflect-annotations";
import { deepStrictEqual as assertEqual, notEqual as assertNotEqual} from 'assert'

describe('schema', () => {
  describe('validation', () => {
    const obj = schema({ type: 'object', properties: { a: { type: 'number' } } })

    it('should validate a schema', async () => {
      assertEqual(await obj.validate({ a: 42 }), { a: 42 })
    })

    it('should detect errors', async() => {
      const errors = await obj.validate({ a: 'foo' }).catch(({ errors }) => errors)
      assertEqual(errors,
        [{
          dataPath: '.a',
          keyword: 'type',
          message: 'should be number',
          params: {
            type: 'number'
          },
          schemaPath: '#/properties/a/type'
        }]
      )
    })
  })

  describe('expansion', () => {
    it('should expand top-level string types', async () => {
      const actual = await schema('string').validate('hello')
      assertEqual(actual, 'hello')
    })

    it('should expand item-level string types', async () => {
      const actual = await schema({ items: 'string' }).validate(['hello'])
      assertEqual(actual, ['hello'])
    })

    it('should expand array string types', async () => {
      const actual = await schema(<const>{ anyOf: ['string', 'number'] }).validate(42)
      assertEqual(actual, 42)
    })

    it('should expand object string types', async () => {
      const actual = await schema(<const>{ properties: { a: 'string' } }).validate({ a: 'asdf' })
      assertEqual(actual, { a: 'asdf' })
    })

    it('should stringify RegExp instances', async () => {
      const pattern = schema(<const>{ type: 'string', pattern: /asdf/ })
      assertEqual(await pattern.validate('asdf'), 'asdf')
    })
  })

  describe('nesting', () => {
    it('should allow nesting of schemas', () => {
      const inner = schema(<const>{ type: 'array', items: { type: ['string', 'number']} })
      const outer = schema({
        type: 'object',
        properties: {
          a: 'string',
          b: inner
        }
      })

      assertEqual(outer.toJSON(), {
        type: 'object',
        properties: {
          a: { type: 'string' },
          b: {
            type: 'array',
            items: {
              type: ['string', 'number']
            }
          }
        }
      })
    })
  })
})

describe('decorator metadata', () => {
  it('should emit decorator metadata at compile time', () => {
    const Thing = schema({
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      },
      required: ['name']
    } as const)
    type Thing = schema<typeof Thing>
    const Random = createAnnotationFactory(class {})
    class SomeClass {
      @Random()
      method (thing: Thing) {}
    }
    const annotations = reflectAnnotations(SomeClass)
    assertEqual(annotations[0]?.types?.parameters?.slice().pop(), Thing)
  })
})

describe('struct', () => {
  class Person extends Struct({
    firstName: 'string',
    lastName: 'string'
  }) {}

  it('should validate a valid struct', async () => {
    const sam = await Person.validate({ firstName: 'sam', lastName: 'yo' })
    assertEqual(sam, { firstName: 'sam', lastName: 'yo' })
  })

  it('should validate an invalid struct', async () => {
    const { errors } = await Person.validate({ firstName: 14, lastName: 'yo' }).catch(errors => errors)
    assertEqual(errors, [
      {
        dataPath: ".firstName",
        keyword: "type",
        message: "should be string",
        params: {
          type: "string"
        },
        schemaPath: "#/properties/firstName/type"
      }
    ])
  })
})
