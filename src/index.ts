import { Schema } from './schema'
import { DefaultSchemaState } from './schema'
import { callableInstance } from './util'

export { Schema } from './schema'
export { Validator, ValidationError } from './validator'

export type schema<T extends Schema<any>> = T['TypeOf']

export const
  schema = new Schema(),
  number = schema.type('number'), // tslint:disable-line:variable-name
  integer = schema.type('integer'),
  string = schema.type('string'), // tslint:disable-line:variable-name
  boolean = schema.type('boolean'), // tslint:disable-line:variable-name
  array = callableInstance(schema.type('array'), 'items'),
  object = callableInstance(schema.type('object'), 'properties')
