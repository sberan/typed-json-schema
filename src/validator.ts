
import Ajv = require('ajv')
import { ErrorObject } from 'ajv'
import { Schema } from './schema'
import { AnyJSON } from './util/lang'

export type CustomKeyword = { name: string } & Ajv.KeywordDefinition

export interface ValidatorOptions extends Ajv.Options {
  customKeywords?: CustomKeyword[]
}

export class Validator {
  ajv: Ajv.Ajv

  constructor (options: ValidatorOptions = {}) {
    this.ajv = new Ajv(options)
    if ( options.customKeywords) {
      options.customKeywords.forEach(kw => {
        this.ajv.addKeyword(kw.name, kw)
      })
    }
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
