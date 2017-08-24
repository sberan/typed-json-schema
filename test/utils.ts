import { expect } from 'chai'
import { AnyJSON, Schema } from '../src/schema'

export function expectSchema <ExpectedType extends AnyJSON> (schema: Schema<ExpectedType>) {
  return expect(schema.toJSON())
}

export function expectSchemaProperty<Z extends Schema<any>, K extends keyof Z['_T'], ExpectedType extends Z['_T'][K]> () {}

export function testSchema<T extends AnyJSON, R> (schema: Schema<T>, fn: (value: T) => R): R { return null as any as R }