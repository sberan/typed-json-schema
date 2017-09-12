import { expect } from 'chai'
import { boolean, number, object, schema, string, Validator } from '../src'
import '../src/ext/strict-properties'

describe('strict properties', () => {
  it('should create the schema', () => {
    const strictSchema = object.strictProperties({ a: number, b: string })

    expect(strictSchema.toJSON()).to.eql({
      type: 'object',
      properties: {
        a: { type: 'number' },
        b: { type: 'string' }
      },
      required: ['a', 'b'],
      additionalProperties: false
    })
  })

  it('should allow optional properties', () => {
    const strictSchema = object.strictProperties({ a: number, b: string }).optional('a')

    expect(strictSchema.toJSON()).to.eql({
      type: 'object',
      properties: {
        a: { type: 'number' },
        b: { type: 'string' }
      },
      required: ['b'],
      additionalProperties: false
    })
  })

  it('should allow optional properties specified before strict', () => {
    const strictSchema = object.optional('a', 'b').strictProperties({ a: number, b: string, c: boolean })

    expect(strictSchema.toJSON()).to.eql({
      type: 'object',
      properties: {
        a: { type: 'number' },
        b: { type: 'string' },
        c: { type: 'boolean' }
      },
      required: ['c'],
      additionalProperties: false
    })
  })
})
