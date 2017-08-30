import { AnyJSON, callableInstance, JSONObject } from "./util/lang";

export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
export type Overwrite<T, U> = { [P in Diff<keyof T, keyof U>]: T[P] } & U;
export type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] }

export type SchemaUpdate<State extends SchemaState, K extends keyof SchemaState, V extends SchemaState[K]> = Schema<Omit<State, K> & {[P in K]: V}>
export type SchemaMultiUpdate<State extends SchemaState, K extends keyof SchemaState, U extends {[P in K]: SchemaState[P]}> = Schema<Overwrite<State, U>>

export type TypeNames = 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'array' | 'object'

export type TypeDefs<State extends SchemaState> = {
  string: string
  number: number
  integer: number
  boolean: boolean
  null: null
  array: (State['items'] | State['additionalItems'])[]
  object: State['anyOf'] & State['oneOf'] & State['allOf'] & {[P in State['required']]: State['properties'][P]['TypeOf']}
        & {[P in Diff<keyof State['properties'], State['required']>]?: State['properties'][P]['TypeOf'] }
        & {[P in State['additionalProperties']['key'] | State['patternProperties']['key']]?: State['additionalProperties']['type'] | State['patternProperties']['type'] },
  enum: State['enum']
  const: State['const']
}

export type SchemaState = {
  type: keyof TypeDefs<DefaultSchemaState>
  items: any
  additionalItems: any
  properties: any
  required: string
  additionalProperties: {key: string, type: any}
  patternProperties: {key: string, type: any}
  enum: any
  anyOf: any
  oneOf: any
  allOf: any
  const: any
}

export type DefaultSchemaState = {
  type: keyof TypeDefs<DefaultSchemaState>
  items: any
  additionalItems: never
  properties: any
  required: never
  additionalProperties: {key: string, type: any}
  patternProperties: {key: never, type: never}
  enum: any
  const: any
  anyOf: {}
  oneOf: {}
  allOf: {}
}

export class Schema<State extends SchemaState = DefaultSchemaState> {
  TypeOf: TypeDefs<State>[State['type']]

  constructor (private readonly props: JSONObject = {}) { }

  setProps (props: JSONObject): any {
    return new Schema(Object.assign({}, this.props, props))
  }

  toJSON() {
    return this.props
  }

  /*======================
  GLOBAL
  ========================*/
  type<TypeKeys extends TypeNames>(type: TypeKeys[]): SchemaUpdate<State, 'type', TypeKeys> 
  type<TypeKeys extends TypeNames>(type: TypeKeys): SchemaUpdate<State, 'type', TypeKeys>
  type<TypeKeys extends TypeNames>(type: string | string[]) {
    return this.setProps({ type })
  }
  
  enum<T extends AnyJSON>(values: T[]): SchemaMultiUpdate<State, 'enum' | 'type', { type: 'enum', enum: T }> {
    return this.setProps({ enum: values })
  }
  
  const<T extends AnyJSON>(constValue: T): SchemaMultiUpdate<State, 'const' | 'type', { type: 'const', const: T }> {
    return this.setProps({ const: constValue })
  }

  // TODO: these repetitions shouldn't be needed, but using the correct type causes an infinite loop in the compiler
  anyOf<T1 extends Schema<any>> (anyOf: [T1]):  SchemaUpdate<State, 'anyOf', T1['TypeOf']>
  anyOf<T1 extends Schema<any>, T2 extends Schema<any>> (anyOf: [T1, T2]):  SchemaUpdate<State, 'anyOf', T1['TypeOf'] | T2['TypeOf']>
  anyOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>> (anyOf: [T1, T2, T3]):  SchemaUpdate<State, 'anyOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']>
  anyOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>> (anyOf: [T1, T2, T3, T4]):  SchemaUpdate<State, 'anyOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']>
  anyOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5]):  SchemaUpdate<State, 'anyOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']>
  anyOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6]):  SchemaUpdate<State, 'anyOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']| T6['TypeOf']>
  anyOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>, T7 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6, T7]):  SchemaUpdate<State, 'anyOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']| T6['TypeOf']| T7['TypeOf']>
  anyOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>, T7 extends Schema<any>, T8 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6, T7, T8]):  SchemaUpdate<State, 'anyOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']| T6['TypeOf']| T7['TypeOf']| T8['TypeOf']>
  anyOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>, T7 extends Schema<any>, T8 extends Schema<any>, T9 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6, T7, T8, T9]):  SchemaUpdate<State, 'anyOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']| T6['TypeOf']| T7['TypeOf']| T8['TypeOf']| T9['TypeOf']>
  anyOf (schemas: any[]) {
    return this.setProps({ anyOf: schemas.map(s => s.props) })
  }

  // TODO: these repetitions shouldn't be needed, but using the correct type causes an infinite loop in the compiler
  oneOf<T1 extends Schema<any>> (anyOf: [T1]):  SchemaUpdate<State, 'oneOf', T1['TypeOf']>
  oneOf<T1 extends Schema<any>, T2 extends Schema<any>> (anyOf: [T1, T2]):  SchemaUpdate<State, 'oneOf', T1['TypeOf'] | T2['TypeOf']>
  oneOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>> (anyOf: [T1, T2, T3]):  SchemaUpdate<State, 'oneOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']>
  oneOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>> (anyOf: [T1, T2, T3, T4]):  SchemaUpdate<State, 'oneOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']>
  oneOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5]):  SchemaUpdate<State, 'oneOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']>
  oneOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6]):  SchemaUpdate<State, 'oneOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']| T6['TypeOf']>
  oneOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>, T7 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6, T7]):  SchemaUpdate<State, 'oneOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']| T6['TypeOf']| T7['TypeOf']>
  oneOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>, T7 extends Schema<any>, T8 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6, T7, T8]):  SchemaUpdate<State, 'oneOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']| T6['TypeOf']| T7['TypeOf']| T8['TypeOf']>
  oneOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>, T7 extends Schema<any>, T8 extends Schema<any>, T9 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6, T7, T8, T9]):  SchemaUpdate<State, 'oneOf', T1['TypeOf'] | T2['TypeOf']| T3['TypeOf']| T4['TypeOf']| T5['TypeOf']| T6['TypeOf']| T7['TypeOf']| T8['TypeOf']| T9['TypeOf']>
  oneOf (schemas: any[]) {
    return this.setProps({ oneOf: schemas.map(s => s.props) })
  }

  // TODO: these repetitions shouldn't be needed, but using the correct type causes an infinite loop in the compiler
  // TODO: these should be intersection types but that doesn't work :(
  allOf<T1 extends Schema<any>> (anyOf: [T1]):  SchemaUpdate<State, 'allOf', T1['TypeOf']>
  allOf<T1 extends Schema<any>, T2 extends Schema<any>> (anyOf: [T1, T2]):  SchemaUpdate<State, 'allOf', T1['TypeOf'] | T2['TypeOf']>
  allOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>> (anyOf: [T1, T2, T3]):  SchemaUpdate<State, 'allOf', T1['TypeOf'] | T2['TypeOf'] | T3['TypeOf']>
  allOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>> (anyOf: [T1, T2, T3, T4]):  SchemaUpdate<State, 'allOf', T1['TypeOf'] | T2['TypeOf'] | T3['TypeOf'] | T4['TypeOf']>
  allOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5]):  SchemaUpdate<State, 'allOf', T1['TypeOf'] | T2['TypeOf'] | T3['TypeOf'] | T4['TypeOf'] | T5['TypeOf']>
  allOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6]):  SchemaUpdate<State, 'allOf', T1['TypeOf'] | T2['TypeOf'] | T3['TypeOf'] | T4['TypeOf'] | T5['TypeOf'] | T6['TypeOf']>
  allOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>, T7 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6, T7]):  SchemaUpdate<State, 'allOf', T1['TypeOf'] | T2['TypeOf'] | T3['TypeOf'] | T4['TypeOf'] | T5['TypeOf'] | T6['TypeOf'] | T7['TypeOf']>
  allOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>, T7 extends Schema<any>, T8 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6, T7, T8]):  SchemaUpdate<State, 'allOf', T1['TypeOf'] | T2['TypeOf'] | T3['TypeOf'] | T4['TypeOf'] | T5['TypeOf'] | T6['TypeOf'] | T7['TypeOf'] | T8['TypeOf']>
  allOf<T1 extends Schema<any>, T2 extends Schema<any>, T3 extends Schema<any>, T4 extends Schema<any>, T5 extends Schema<any>, T6 extends Schema<any>, T7 extends Schema<any>, T8 extends Schema<any>, T9 extends Schema<any>> (anyOf: [T1, T2, T3, T4, T5, T6, T7, T8, T9]):  SchemaUpdate<State, 'allOf', T1['TypeOf'] | T2['TypeOf'] | T3['TypeOf'] | T4['TypeOf'] | T5['TypeOf'] | T6['TypeOf'] | T7['TypeOf'] | T8['TypeOf'] | T9['TypeOf']>
  allOf (schemas: any[])  {
    return this.setProps({ allOf: schemas.map(s => s.props) })
  }

  title (title: string): this {
    return this.setProps({ title })
  }

  description (description: string): this {
    return this.setProps({ description })
  }

  default (defaultValue: AnyJSON): this {
    return this.setProps({ default: defaultValue })
  }

  not <X extends SchemaState> (schema: Schema<X>): this {
    return this.setProps({ not: schema.props })
  }

  /*============
  Array
  =============*/
  items<ItemsSchema extends Schema<any>> (items: ItemsSchema[]): SchemaUpdate<State, 'items', ItemsSchema['TypeOf']>
  items<ItemsSchema extends Schema<any>> (items: ItemsSchema): SchemaUpdate<State, 'items', ItemsSchema['TypeOf']>
  items<ItemsSchema extends Schema<any>> (items: ItemsSchema | ItemsSchema[]) {
    if (Array.isArray(items)) {
      return this.setProps({ items: items.map(i => i.props)})
    } else {
      return this.setProps({ items: items.props })
    }
  }
  
  additionalItems (additionalItems: true): SchemaUpdate<State, 'additionalItems', any > 
  additionalItems (additionalItems: false): this
  additionalItems<ItemsSchema extends Schema<any>> (additionalItems: ItemsSchema): SchemaUpdate<State, 'additionalItems', ItemsSchema['TypeOf'] >  
  additionalItems<ItemsSchema extends Schema<any>> (additionalItems: boolean | ItemsSchema) {
    if (additionalItems === true) {
      return this.setProps({ additionalItems: true })
    } else if (additionalItems === false) {
      return this
    } else {
      return this.setProps({ additionalItems: additionalItems.props })
    }
  }

  contains (contains: Schema<any>): this {
    return this.setProps({ contains: contains.props })
  }

  maxItems (maxItems: number): this {
    return this.setProps({ maxItems })
  }

  minItems (minItems: number): this {
    return this.setProps({ minItems })
  }

  uniqueItems (uniqueItems: boolean): this {
    return this.setProps({ uniqueItems })
  }

  /*===============
  OBJECT
  =================*/
  properties<K extends string, Properties extends {[P in K]: Schema<any>}>(properties: Properties): SchemaUpdate<State, 'properties', Properties> {
    const props = Object.keys(properties).reduce<JSONObject>((acc, key: K) => {
      acc[key] = (properties[key] as Schema<any>).props
      return acc
    }, {})
    return this.setProps({ properties: props })
  }

  required<K extends string>(...required: K[]): SchemaUpdate<State, 'required', K> {
    return this.setProps({ required })
  }

  additionalProperties (additionalProperties: true): SchemaUpdate<State, 'additionalProperties', {key: string, type: any}>
  additionalProperties (additionalProperties: false): SchemaUpdate<State, 'additionalProperties', {key: never, type: never}>
  additionalProperties<T extends Schema<any>> (additionalProperties: T): SchemaUpdate<State, 'additionalProperties', {key: string, type: T['TypeOf']}>
  additionalProperties (additionalProperties: boolean | Schema<any>): any {
    if (additionalProperties instanceof Schema) {
      return this.setProps({ additionalProperties: additionalProperties.props })
    } else {
      return this.setProps({ additionalProperties })
    }
  }
  
  patternProperties<T extends Schema<any>> (patternProperties: { [key: string]: T }): SchemaUpdate<State, 'patternProperties', {key: string, type: T['TypeOf']}> {
    const props = Object.keys(patternProperties).reduce<JSONObject>((acc, key: keyof typeof patternProperties) => {
      acc[key] = patternProperties[key].props
      return acc
    }, {})
    return this.setProps({ patternProperties: props })
  }

  dependencies (dependencies: {[key: string]: Schema<any> | string[]}): this {
    const props = Object.keys(dependencies).reduce<JSONObject>((acc, key) => {
      const value = dependencies[key]
      if (Array.isArray(value)) {
        acc[key] = value
      } else {
        acc[key] = value.props
      }
      return acc
    }, {})
    return this.setProps({ dependencies: props })
  }

  maxProperties(maxProperties: number): this {
    return this.setProps({ maxProperties })
  }

  minProperties(minProperties: number): this {
    return this.setProps({ minProperties })
  }

  /*===================
  NUMBER
  =====================*/
  maximum(maximum: number): this {
    return this.setProps({ maximum })
  }

  minimum(minimum: number): this {
    return this.setProps({ minimum })
  }

  exclusiveMaximum(exclusiveMaximum: number | boolean): this {
    return this.setProps({ exclusiveMaximum })
  }

  exclusiveMinimum(exclusiveMinimum: number | boolean): this {
    return this.setProps({ exclusiveMinimum })
  }

  multipleOf(multipleOf: number): this {
    return this.setProps({ multipleOf })
  }

  /*=============
  STRING
  ===============*/
  maxLength (maxLength: number): this {
    return this.setProps({ maxLength })
  }

  minLength (minLength: number): this {
    return this.setProps({ minLength })
  }

  pattern (pattern: RegExp): this {
    return this.setProps({ pattern: pattern.source })
  }

  format (format: string): this {
    return this.setProps({ format })
  }
}

declare module './schema' {
  //make schema instances newable so that they can be validated using decorators
  export interface Schema<State extends SchemaState> {
    new (...args: any[]): never
  }
}
