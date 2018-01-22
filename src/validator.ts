
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

export class ValidationError extends Error {
  constructor (input: any, schema: Schema<any>, public errors: ErrorObject[]) {
    super(`

could not validate object:
${JSON.stringify(input, null, 2)}

against schema:
${JSON.stringify(schema.toJSON(), null, 2)}

errors:
  * ${errors.map(e => e.message).join('\n  * ')}`)
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Validator {
  ajv: Ajv.Ajv

  constructor (options: ValidatorOptions = {}) {
    this.ajv = new Ajv(options)
    if (options.customKeywords) {
      addCustomKeywords(this.ajv, options.customKeywords)
    }
  }

  /**
   * @deprecated use validate instead
   */
  validateSync <T extends Schema<any>> (schema: T, obj: any)
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

  validate <T extends Schema<any>> (schema: T, obj: any): Promise<T['TypeOf']> {
    const validate = this.ajv.compile(schema.toJSON())
    const coercedValue: { result?: T } = { }
    validate(obj, undefined, coercedValue, 'result')
    if (!validate.errors) {
      return Promise.resolve(coercedValue.result !== undefined ? coercedValue.result : obj)
    } else {
      return Promise.reject(new ValidationError(obj, schema, validate.errors))
    }
  }
}
