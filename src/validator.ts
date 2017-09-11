
import Ajv = require('ajv')
import { ErrorObject } from 'ajv'
import { Schema } from './schema'
import { AnyJSON } from './util/lang'

export class Validator {
  ajv: Ajv.Ajv

  constructor (options: Ajv.Options = {}) {
    this.ajv = new Ajv(options)
  }

  validate <T extends Schema<any>> (schema: T, obj: any)
      : { valid: false, errors: ErrorObject[], result: null }
      | { valid: true, errors: null, result: T['TypeOf'] }  {
    const validate = this.ajv.compile(schema.toJSON())
    const coercedValue: { result?: T } = { }
    const isValid = validate(obj, undefined, coercedValue, 'result')
    if (isValid) {
      return { errors: null, result: coercedValue.result !== undefined ? coercedValue.result : obj, valid: true }
    } else {
      return { errors: validate.errors!, result: null, valid: false }
    }
  }
}
