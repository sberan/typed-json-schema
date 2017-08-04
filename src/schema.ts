
export type JSONPrimitive = string | number | boolean | null
export interface JSONArray extends Array<JSONPrimitive | JSONObject | JSONArray> {}
export interface JSONObject { [key: string]: JSONObject | JSONPrimitive | JSONArray }
export type AnyJSON = JSONPrimitive | JSONArray | JSONObject

export class Schema<T> {
  constructor (public props: JSONObject = {}) { } //TODO: make props private

  setProps (props: JSONObject): this {
    var clone = Object.create(this)
    clone.props = Object.assign({}, this.props, props)
    return clone
  }

  toJSON() {
    return this.props
  }

  getTypeToken() {
    return null as any as T
  }

  type(type: 'number'): NumberSchema
  type(type: 'integer'): NumberSchema
  type(type: 'string'): StringSchema
  type(type: 'boolean'): BooleanSchema
  type(type: 'null'): NullSchema
  type(type: 'array'): ArraySchema<any>
  type(type: 'object'): ObjectSchema<{[x: string]: any}, never, {[x: string]: any}, {}, {}>
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
    //todo: combine enum type with parent type
    return this.setProps({ enum: values as any }) as any as Schema<V>
  }

  allOf <A0> (a0: Schema<A0>): Schema<A0>
  allOf <A0, A1> (a0: Schema<A0>, a1: Schema<A1>): Schema<A0 & A1>
  allOf <A0, A1, A2> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>): Schema<A0 & A1 & A2>
  allOf <A0, A1, A2, A3> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>): Schema<A0 & A1 & A2 & A3>
  allOf <A0, A1, A2, A3, A4> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>): Schema<A0 & A1 & A2 & A3 & A4>
  allOf <A0, A1, A2, A3, A4, A5> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>): Schema<A0 & A1 & A2 & A3 & A4 & A5>
  allOf <A0, A1, A2, A3, A4, A5, A6> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>): Schema<A0 & A1 & A2 & A3 & A4 & A5 & A6>
  allOf <A0, A1, A2, A3, A4, A5, A6, A7> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>): Schema<A0 & A1 & A2 & A3 & A4 & A5 & A6 & A7>
  allOf <A0, A1, A2, A3, A4, A5, A6, A7, A8> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>): Schema<A0 & A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8>
  allOf <A0, A1, A2, A3, A4, A5, A6, A7, A8, A9> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>, a9: Schema<A9>): Schema<A0 & A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9>
  allOf(...values: Schema<any>[]): Schema<any> {
    return this.setProps({ allOf: values.map(v => v.props) })
  }
  
  anyOf <A0> (a0: Schema<A0>): Schema<A0>
  anyOf <A0, A1> (a0: Schema<A0>, a1: Schema<A1>): Schema<A0 | A1>
  anyOf <A0, A1, A2> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>): Schema<A0 | A1 | A2>
  anyOf <A0, A1, A2, A3> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>): Schema<A0 | A1 | A2 | A3>
  anyOf <A0, A1, A2, A3, A4> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>): Schema<A0 | A1 | A2 | A3 | A4>
  anyOf <A0, A1, A2, A3, A4, A5> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>): Schema<A0 | A1 | A2 | A3 | A4 | A5>
  anyOf <A0, A1, A2, A3, A4, A5, A6> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6>
  anyOf <A0, A1, A2, A3, A4, A5, A6, A7> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7>
  anyOf <A0, A1, A2, A3, A4, A5, A6, A7, A8> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8>
  anyOf <A0, A1, A2, A3, A4, A5, A6, A7, A8, A9> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>, a9: Schema<A9>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9>
  anyOf(...values: Schema<any>[]) {
    return this.setProps({ anyOf: values.map(v => v.props) })
  }

  oneOf <A0> (a0: Schema<A0>): Schema<A0>
  oneOf <A0, A1> (a0: Schema<A0>, a1: Schema<A1>): Schema<A0 | A1>
  oneOf <A0, A1, A2> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>): Schema<A0 | A1 | A2>
  oneOf <A0, A1, A2, A3> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>): Schema<A0 | A1 | A2 | A3>
  oneOf <A0, A1, A2, A3, A4> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>): Schema<A0 | A1 | A2 | A3 | A4>
  oneOf <A0, A1, A2, A3, A4, A5> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>): Schema<A0 | A1 | A2 | A3 | A4 | A5>
  oneOf <A0, A1, A2, A3, A4, A5, A6> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6>
  oneOf <A0, A1, A2, A3, A4, A5, A6, A7> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7>
  oneOf <A0, A1, A2, A3, A4, A5, A6, A7, A8> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8>
  oneOf <A0, A1, A2, A3, A4, A5, A6, A7, A8, A9> (a0: Schema<A0>, a1: Schema<A1>, a2: Schema<A2>, a3: Schema<A3>, a4: Schema<A4>, a5: Schema<A5>, a6: Schema<A6>, a7: Schema<A7>, a8: Schema<A8>, a9: Schema<A9>): Schema<A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9>
  oneOf(...values: Schema<any>[]) {
    return this.setProps({ oneOf: values.map(v => v.props) })
  }

  not(schema: Schema<any>) {
    return this.setProps({ not: schema.props })
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

const
  schema = new Schema<any>({}),
  number = schema.type('number'),
  integer = schema.type('integer'),
  string = schema.type('string'),
  boolean = schema.type('boolean'),
  array = callableInstance(schema.type('array'), 'items'),
  object = callableInstance(schema.type('object'), 'properties')

export {
  schema,
  number,
  integer,
  string,
  boolean,
  array,
  object
}