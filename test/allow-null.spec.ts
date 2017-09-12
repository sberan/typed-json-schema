import { expect } from 'chai'
import { schema, Validator } from '../src'
import '../src/ext/allow-null'

describe('trim keyword', () => {
  it('should create the schema', () => {
    const nullableString = schema.type('string').allowNull()

    expect(nullableString.toJSON()).to.eql({ type: ['string', 'null'] })
  })
})
