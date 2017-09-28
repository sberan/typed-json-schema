import { expect } from 'chai'
import { schema, Validator } from '../src'
import { trim } from '../src/ext/trim'

describe('trim keyword', () => {
  it('should create the schema', () => {
    const trimmedString = schema.type('string').trim(true)

    expect(trimmedString.toJSON()).to.eql({ type: 'string', trim: true })
  })

  it('should trim the value when validating', async () => {
    const trimmedStringSchema = schema.type('string').trim(true),
      validator = new Validator({ coerceTypes: true, customKeywords: [trim] })

    const trimmedString = await validator.validate(trimmedStringSchema, ' asdf ')
    expect(trimmedString).to.eql('asdf')
  })
})
