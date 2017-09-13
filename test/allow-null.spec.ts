import { expect } from 'chai'
import { schema, Validator } from '../src'
import '../src/ext/allow-null'

describe('allowNull keyword', () => {
  it('should create the schema for a nullable string', () => {
    const nullableString = schema.type('string').allowNull()

    expect(nullableString.toJSON()).to.eql({ type: ['string', 'null'] })
  })

  it('should create the schema for a typeless schema', () => {
    const nullableAny = schema.allowNull()

    expect(nullableAny.toJSON()).to.eql({})
  })

  it('should create the schema for an enum', () => {
    const nullableEnum = schema.enum([1, 2, 3]).allowNull()

    expect(nullableEnum.toJSON()).to.eql({ enum: [1, 2, 3, null]})
  })

  it('should create the schema for a typed enum', () => {
    const nullableEnum = schema.type('string').enum([1, 2, 3]).allowNull()

    expect(nullableEnum.toJSON()).to.eql({ type: ['string', 'null'], enum: [1, 2, 3, null]})
  })
})
