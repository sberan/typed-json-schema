
import Ajv = require('ajv')
import { ErrorObject } from 'ajv'
import { Schema } from './schema'
import { AnyJSON } from './util'

export interface CustomKeyword extends Ajv.KeywordDefinition {
  name: string
}

export type CustomKeywords = Array<CustomKeyword | CustomKeyword[]>

export interface ValidatorOptions extends Ajv.Options {
  customKeywords?: CustomKeywords
}

function addCustomKeywords (ajv: Ajv.Ajv, customKeywords: CustomKeywords) {
  customKeywords.forEach(kw => {
    if (Array.isArray(kw)) {
      addCustomKeywords(ajv, kw)
    } else {
      ajv.addKeyword(kw.name, kw)
    }
  })
}

export class Validator {
  ajv: Ajv.Ajv

  constructor (options: ValidatorOptions = {}) {
    this.ajv = new Ajv(options)
    if (options.customKeywords) {
      addCustomKeywords(this.ajv, options.customKeywords)
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
