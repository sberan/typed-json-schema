import { Schema } from './schema'
import { callableInstance } from './util/lang'
import { DefaultSchemaState } from './schema';

export { Schema } from './schema'
export { Validator } from './validator'

export type schema<T extends Schema<any>> = T['TypeOf']

export const
  schema = new Schema(),
  number = schema.type('number'),
  integer = schema.type('integer'),
  string = schema.type('string'),
  boolean = schema.type('boolean'),
  array = callableInstance(schema.type('array'), 'items'),
  object = callableInstance(schema.type('object'), 'properties')
