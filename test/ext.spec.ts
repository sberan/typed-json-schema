import { expect } from 'chai'
import { schema, Validator } from '../src'
import { ext } from '../src/ext'

describe('ext index', () => {
  it('should trim the value when validating', async () => {
    const trimmedStringSchema = schema.type('string').trim(true),
      validator = new Validator({ coerceTypes: true, customKeywords: ext })

    const trimmedString = await validator.validate(trimmedStringSchema, ' asdf ')
    expect(trimmedString).to.eql('asdf')
  })
})
