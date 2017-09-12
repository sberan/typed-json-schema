import { expect } from 'chai'
import { schema, Validator } from '../src'
import { ext } from '../src/ext'

describe('ext index', () => {
  it('should trim the value when validating', () => {
    const trimmedStringSchema = schema.type('string').trim(true),
      validator = new Validator({ coerceTypes: true, customKeywords: ext })

    const trimmedString = validator.validate(trimmedStringSchema, ' asdf ').result
    expect(trimmedString).to.eql('asdf')
  })
})
