import 'reflect-metadata'

import Ajv = require('ajv')
import { ErrorObject } from 'ajv'

export type JSONPrimitive = string | number | boolean | null | undefined
export interface JSONArray extends Array<AnyJSON> {}
export interface JSONObject { [key: string]: AnyJSON }
export type AnyJSON = JSONPrimitive | JSONArray | JSONObject


export class Schema<T extends AnyJSON> {
  constructor (public props: JSONObject = {}) { } //TODO: make props private

  _T: T

  setProps (props: JSONObject): this {
    var clone = Object.create(this)
    clone.props = Object.assign({}, this.props, props)
    return clone
  }

  toJSON() {
    return this.props
  }

  type(type: 'number'): NumberSchema
  type(type: 'integer'): NumberSchema
  type(type: 'string'): StringSchema
  type(type: 'boolean'): BooleanSchema
  type(type: 'null'): NullSchema
  type(type: 'array'): ArraySchema<any>
  type(type: 'object'): ObjectSchema<JSONObject, never, JSONObject, {}, {}>
  type (type: string) {
    if (type === 'string') {
      return new StringSchema()
    }
    if (type === 'boolean') {
      return new BooleanSchema()
    }
    if (type === 'null') {
      return new NullSchema()
    }
    if (type === 'number') {
      return new NumberSchema()
    }
    if (type === 'integer') {
      return new NumberSchema({ type: 'integer' })
    }
    if (type === 'array') {
      return new ArraySchema<any[]>()
    }
    if (type === 'object') {
      return new ObjectSchema<{[x: string]: any}, never, {[x: string]: any}, {}, {}>()
    }
  }

  title (title: string) {
    return this.setProps({ title })
  }

  description (description: string) {
    return this.setProps({ description })
  }

  default (defaultValue: AnyJSON) {
    return this.setProps({ default: defaultValue })
  }

  enum <V extends AnyJSON>(values: V[]) {
    //todo: use arrays instead of varargs everywhere because type inference works better
    //todo: combine incoming enum type with parent type
    return this.setProps({ enum: values as any }) as any as Schema<V>
  }

  allOf <A0 extends AnyJSON>  (a0: Schema<A0>): Schema<A0>
  allOf <A0 extends AnyJSON, A1 extends AnyJSON>  (a0: Schema<A0>, a1: Schema<A1>): Schema<A0 | A1>
  allOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON>  (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>): Schema<A0 | A1 | A2>
  allOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON>  (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>): Schema<A0 | A1 | A2 | A3>
  allOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON>  (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>): Schema<A0 | A1 | A2 | A3 | A4>
  allOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON>  (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>): Schema<A0 | A1 | A2 | A3 | A4 | A5>
  allOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON>  (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6>
  allOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON>  (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7>
  allOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON, A8 extends AnyJSON>  (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8>
  allOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON, A8 extends AnyJSON, A9 extends AnyJSON>  (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>, a9: Schema<A9>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9>
  allOf(...values: Schema<any>[]): Schema<any> {
    return this.setProps({ allOf: values.map(v => v.props) })
  }
  
  anyOf <A0 extends AnyJSON> (a0: Schema<A0>): Schema<A0>
  anyOf <A0 extends AnyJSON, A1 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>): Schema<A0 | A1>
  anyOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>): Schema<A0 | A1 | A2>
  anyOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>): Schema<A0 | A1 | A2 | A3>
  anyOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>): Schema<A0 | A1 | A2 | A3 | A4>
  anyOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>): Schema<A0 | A1 | A2 | A3 | A4 | A5>
  anyOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6>
  anyOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7>
  anyOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON, A8 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8>
  anyOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON, A8 extends AnyJSON, A9 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>, a9: Schema<A9>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9>
  anyOf(...values: Schema<any>[]) {
    return this.setProps({ anyOf: values.map(v => v.props) })
  }

  oneOf <A0 extends AnyJSON> (a0: Schema<A0>): Schema<A0>
  oneOf <A0 extends AnyJSON, A1 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>): Schema<A0 | A1>
  oneOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>): Schema<A0 | A1 | A2>
  oneOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>): Schema<A0 | A1 | A2 | A3>
  oneOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>): Schema<A0 | A1 | A2 | A3 | A4>
  oneOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>): Schema<A0 | A1 | A2 | A3 | A4 | A5>
  oneOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6>
  oneOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7>
  oneOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON, A8 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8>
  oneOf <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON, A8 extends AnyJSON, A9 extends AnyJSON> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>, a9: Schema<A9>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9>
  oneOf(...values: Schema<any>[]) {
    return this.setProps({ oneOf: values.map(v => v.props) })
  }

  not <X extends AnyJSON> (schema: Schema<X>) {
    return this.setProps({ not: schema.props })
  }
}

declare module './schema' {
  //make schema instances newable so that they can be validated using decorators
  export interface Schema<T extends AnyJSON> {
    new (value: T): T
  }
}

import { StringSchema } from "./string";
import { BooleanSchema } from "./boolean";
import { NullSchema } from "./null";
import { NumberSchema } from "./number";
import { ArraySchema } from "./array";
import { ObjectSchema } from "./object";

function callableInstance <T extends { [P in K]: Function }, K extends keyof T> (obj: T, key: K): T & T[K] {
  const
    boundMethod: T[K] = obj[key].bind(obj),
    merged = Object.assign(boundMethod, obj)

  ;(boundMethod as any).__proto__ = (obj as any).__proto__
  return merged
}

export class Validator {
  ajv: Ajv.Ajv

  constructor(options: Ajv.Options = {}) {
    this.ajv = new Ajv(options)
  }

  validate <T extends AnyJSON>(schema: Schema<T>, obj: any): { valid: false, errors: Array<ErrorObject>, result: null } | { valid: true, errors: null, result: T }  {
    const validate = this.ajv.compile(schema.toJSON())
    const coercedValue: { result?: T } = { }
    const isValid = validate(obj, undefined, coercedValue, 'result')
    if (isValid) {
      return { errors: null, result: coercedValue.result || obj, valid: true }
    } else {
      return { errors: validate.errors!, result: null, valid: false }
    }
  }
}

const
  schema = new Schema<any>({}),
  number = schema.type('number'),
  integer = schema.type('integer'),
  string = schema.type('string'),
  boolean = schema.type('boolean'),
  array = callableInstance(schema.type('array'), 'items'), //todo: this polutes all array types, it should only be on the base type
  object = callableInstance(schema.type('object'), 'properties')


type schema<T extends Schema<any>> = T['_T']

function createValidationDecorator <T extends MethodDecorator>(delegate: T, options: Ajv.Options = {}) {
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<Function>) => {
    const method = descriptor.value!
    const expectedParamTypes: any[] = Reflect.getMetadata('design:paramtypes', target, propertyKey)
    const validator = new Validator(options)
    for(let i = 0; i < expectedParamTypes.length; i++) {
      const paramType = expectedParamTypes[i]
      if (paramType === Number) {
        expectedParamTypes[i] = number
      } else if (paramType === String) {
        expectedParamTypes[i] = string
      } else if (paramType === Boolean) {
        expectedParamTypes[i] = boolean
      }
    }
    descriptor.value = function (...incomingArgs: any[]) {
      const errorMessages: string[] = []
      for (let i = 0; i < expectedParamTypes.length; i++) {
        const paramType = expectedParamTypes[i]
        if (paramType instanceof Schema) {
          const { result, errors } = validator.validate(paramType, incomingArgs[i])
          if (errors) {
            errorMessages.push(`argument ${i}: value \`${JSON.stringify(incomingArgs[i])}\` did not match schema ${JSON.stringify(paramType.toJSON())}`)
          } else {
            incomingArgs[i] = result
          }
        }
      }
      if (errorMessages.length) {
        const indent = '\n       '
        throw new TypeError(`invalid invocation of ${target.constructor.name}.${propertyKey}:${indent}${errorMessages.join(indent)}`)
      }
      return method.apply(this, incomingArgs)
    }
  }
}

const ValidateArgs = (options: Ajv.Options = {}) => createValidationDecorator(() => {}, options)

export {
  schema,
  number,
  integer,
  string,
  boolean,
  array,
  object,
  createValidationDecorator,
  ValidateArgs
}
