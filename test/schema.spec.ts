import { schema } from "../tjs"
import { deepStrictEqual as assertEqual } from 'assert'

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