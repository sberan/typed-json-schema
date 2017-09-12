import { AnyJSON, Diff, JSONObject, Omit, Overwrite } from './util'

export type SchemaUpdate<
  State extends SchemaState, K extends keyof SchemaState,
  V extends SchemaState[K]
> = Schema<Omit<State, K> & {[P in K]: V}>

export type SchemaMultiUpdate<
  State extends SchemaState,
  K extends keyof SchemaState,
  U extends {[P in K]: SchemaState[P]}
> = Schema<Overwrite<State, U>>

export type TypeNames = 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'array' | 'object'

export interface TypeDefs<State extends SchemaState> {
  any: any
  string: string
  number: number
  integer: number
  boolean: boolean
  null: null
  array: Array<State['items'] | State['additionalItems']>
  object: State['anyOf'] & State['oneOf'] & State['allOf']
        & {[P in State['required']]: State['properties'][P]}
        & {[P in Diff<keyof State['properties'], State['required']>]?: State['properties'][P] }
        & {[P in State['additionalProperties']['key'] | State['patternProperties']['key']]
           ?: State['additionalProperties']['type'] | State['patternProperties']['type'] },
  enum: State['enum']
  const: State['const']
}

export interface SchemaState {
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

export interface DefaultSchemaState {
  type: 'any'
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

  toJSON () {
    return this.props
  }

  /*======================
  GLOBAL
  ========================*/
  type<TypeKeys extends TypeNames> (type: TypeKeys[] | TypeKeys): SchemaUpdate<State, 'type', TypeKeys> {
    return this.setProps({ type })
  }

  enum<T extends AnyJSON> (values: T[]): SchemaMultiUpdate<State, 'enum' | 'type', { type: 'enum', enum: T }> {
    return this.setProps({ enum: values })
  }

  const<T extends AnyJSON> (constValue: T): SchemaMultiUpdate<State, 'const' | 'type', { type: 'const', const: T }> {
    return this.setProps({ const: constValue })
  }

  anyOf<S extends Schema<any>> (schemas: S[]): SchemaUpdate<State, 'anyOf', S['TypeOf']> {
    return this.setProps({ anyOf: schemas.map((s) => s.props) })
  }

  oneOf<S extends Schema<any>> (schemas: S[]): SchemaUpdate<State, 'oneOf', S['TypeOf']> {
    return this.setProps({ oneOf: schemas.map((s) => s.props) })
  }

  // TODO: these should be intersection types but that doesn't work :(
  allOf<S extends Schema<any>> (schemas: S[]): SchemaUpdate<State, 'allOf', S['TypeOf']> {
      return this.setProps({ allOf: schemas.map((s) => s.props) })
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
  items<ItemsSchema extends Schema<any>> (items: ItemsSchema[] | ItemsSchema)
      : SchemaUpdate<State, 'items', ItemsSchema['TypeOf']> {
    if (Array.isArray(items)) {
      return this.setProps({ items: items.map((i) => i.props)})
    } else {
      return this.setProps({ items: items.props })
    }
  }

  additionalItems (additionalItems: true): SchemaUpdate<State, 'additionalItems', any>
  additionalItems (additionalItems: false): this
  additionalItems<ItemsSchema extends Schema<any>> (additionalItems: ItemsSchema)
      : SchemaUpdate<State, 'additionalItems', ItemsSchema['TypeOf'] >
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
  properties<Properties extends {[P: string]: Schema<any>}> (properties: Properties)
      : SchemaUpdate<State, 'properties', {[K in keyof Properties]: Properties[K]['TypeOf']}> {
    const props = Object.keys(properties).reduce<JSONObject>((acc, key: keyof Properties) => {
      acc[key] = (properties[key] as Schema<any>).props
      return acc
    }, {})
    return this.setProps({ properties: props })
  }

  required<K extends string> (...required: K[]): SchemaUpdate<State, 'required', K> {
    return this.setProps({ required })
  }

  additionalProperties (additionalProperties: true)
      : SchemaUpdate<State, 'additionalProperties', {key: string, type: any}>
  additionalProperties (additionalProperties: false)
      : SchemaUpdate<State, 'additionalProperties', {key: never, type: never}>
  additionalProperties<T extends Schema<any>> (additionalProperties: T)
      : SchemaUpdate<State, 'additionalProperties', {key: string, type: T['TypeOf']}>
  additionalProperties (additionalProperties: boolean | Schema<any>): any {
    if (additionalProperties instanceof Schema) {
      return this.setProps({ additionalProperties: additionalProperties.props })
    } else {
      return this.setProps({ additionalProperties })
    }
  }

  patternProperties<T extends Schema<any>> (patternProperties: { [key: string]: T })
      : SchemaUpdate<State, 'patternProperties', {key: string, type: T['TypeOf']}> {
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

  maxProperties (maxProperties: number): this {
    return this.setProps({ maxProperties })
  }

  minProperties (minProperties: number): this {
    return this.setProps({ minProperties })
  }

  /*===================
  NUMBER
  =====================*/
  maximum (maximum: number): this {
    return this.setProps({ maximum })
  }

  minimum (minimum: number): this {
    return this.setProps({ minimum })
  }

  exclusiveMaximum (exclusiveMaximum: number | boolean): this {
    return this.setProps({ exclusiveMaximum })
  }

  exclusiveMinimum (exclusiveMinimum: number | boolean): this {
    return this.setProps({ exclusiveMinimum })
  }

  multipleOf (multipleOf: number): this {
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

// make schema instances newable so that they can be validated using decorators
declare module './schema' {
  // tslint:disable-next-line:no-shadowed-variable
  export interface Schema<State extends SchemaState> {
    new (...args: any[]): never
  }
}
