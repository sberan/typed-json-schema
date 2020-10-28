import { AnyJsonArray, AnyJson, AnyJsonObject } from './json'
import { Keyword, JsonTypeName, Keywords, TypeOf, Invert } from './keywords'
import { IntersectItems } from './util'
import { Validator } from './validator'

type SchemaInput = Schema<Keywords> | JsonTypeName

type SchemaKeyword<S extends SchemaInput> =
  S extends Schema<infer K> ? K
  : S extends JsonTypeName ? { type: S }
  : never

type SchemaKeywordsArray<Schemas extends SchemaInput[]> =
  {[I in keyof Schemas]: Schemas[I] extends SchemaInput ? SchemaKeyword<Schemas[I]> : never }

type SchemaKeywords<Schemas extends SchemaInput[]> =
  SchemaKeywordsArray<Schemas>[number]

type ExcludeObject<K1, K2> = {
  'calc': {[P in keyof K1]: P extends keyof K2 ? Exclude<K1[P], K2[P]> : K1[P]}
}

type SchemaUnion<K extends Keywords, Schemas extends SchemaInput[]> =
  SchemaKeywords<Schemas> extends infer ItemKeyword
    ? ItemKeyword & K
    : never

type SchemaDifference<K extends Keywords, Schemas extends Keywords[]> =
  {[I in keyof Schemas]: ExcludeObject<Schemas[I] & K, {[O in keyof Schemas]: O extends I ? never : Schemas[O]}[number]>['calc'] }
  
type SchemaIntersection<Schemas extends SchemaInput[]> =
  IntersectItems<SchemaKeywordsArray<Schemas>>

type Update<K extends Keywords, U extends Keywords> = {
  'calc': Schema<IntersectItems<[K, U]>>
}

function jsonValue (input: SchemaInput) {
  if (typeof input === 'string') {
    return { type: input }
  }
  return input.toJSON()
}

function jsonPropertyValues(input: {[key: string]: SchemaInput | string[]}) {
  const properties: {[key: string]: Keywords | string[]} = {}
  for (let key of Object.keys(input)) {
    const value = input[key]
    properties[key] = Array.isArray(value) ? value : jsonValue(value)
  }
  return properties
}

const validator = new Validator()

export class Schema<K extends Keywords> {
  // represents the TypeScript type of the schema
  _T: TypeOf<K> = null as any

  // retain Keywords used to calculate _T, useful for debugging
  _K: K = null as any
  
  constructor(private jsonSchema: AnyJsonObject) { }

  toJSON() { return this.jsonSchema }
  
  update<U extends Keywords = K> ( value: AnyJsonObject): Schema<U> {
    return new Schema<any>({ ...this.jsonSchema, ...value })
  }

  check(input: any): input is this['_T'] {
    const result = validator.validateSync(this, input)
    return result.valid
  }

  parse(input: string): this['_T'] {
    const result = validator.validateSync(this, JSON.parse(input))
    if (!result.valid) {
      throw new Error(`invalid type for schema ${JSON.stringify(this.jsonSchema)}: ${input}`)
    }
    return result.result
  }

  /*----------------
   * Generic 
   *----------------*/

  title(title: string) {
    return this.update({ title })
  }

  description(description: string) {
    return this.update({ description })
  }

  default(value: AnyJson) {
    return this.update({ default: value })
  }

  example(example: string) {
    return this.update({ example })
  }
  
  const<Const extends AnyJson>(c: Const)
    : Update<K, Keyword.Const<Const>>['calc'] {
    return this.update<any>({ const: c })
  }

  enum<Enum extends AnyJsonArray>(...items: Enum)
    : Update<K, Keyword.Enum<Enum[number]>>['calc'] {
    return this.update<any>({ enum: items })
  }

  oneOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Schema<SchemaDifference<K, SchemaKeywordsArray<Schemas>>[number]> {
    return this.update<any>({ oneOf: items.map(item => jsonValue(item)) })
  }

  anyOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Schema<SchemaUnion<K, Schemas>> {
    return this.update<any>({ anyOf: items.map(item => jsonValue(item)) })
  }

  allOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, SchemaIntersection<Schemas>>['calc'] {
    return this.update<any>({ allOf: items.map(item => jsonValue(item)) })
  }
  
  not<Input extends SchemaInput>(not: Input) : Schema<Invert<SchemaKeyword<Input>>> {
    return this.update<any>({ not: jsonValue(not) })
  }

  /*----------------
   * Object 
   *----------------*/

  properties<Properties extends {[key: string]: SchemaInput}>(props: Properties)
    : Update<K, Keyword.Properties<{ [P in keyof Properties]: SchemaKeyword<Properties[P]> }>>['calc'] {
    const properties: {[key: string]: Keywords} = {}
    for (let key of Object.keys(props)) {
      properties[key] = jsonValue(props[key])
    }
    return this.update<any>({ properties })
  }

  required<Keys extends string>(...required: Keys[])
    : Update<K, Keyword.Required<Keys>>['calc'] {
    return this.update<any>({ required })
  }

  additionalProperties<T extends boolean | SchemaInput>(additionalProperties: T)
    : Update<K,
      T extends false ? Keyword.AdditionalPropertiesFalse
      : T extends SchemaInput ? Keyword.AdditionalPropertiesType<SchemaKeyword<T>>
      : { }
    >['calc'] {
    if (typeof additionalProperties === 'boolean') {
      return this.update<any>({ additionalProperties })
    }
    return this.update<any>({ additionalProperties: jsonValue(additionalProperties as SchemaInput) })
  }

  dependencies(props: {[key:string]: SchemaInput | string[]}) {
    const dependencies = jsonPropertyValues(props)
    return this.update({ dependencies })
  }

  patternProperties(props:  {[key:string]: SchemaInput }) {
    const patternProperties = jsonPropertyValues(props)
    return this.update({ patternProperties })
  }

  minProperties(minProperties: number) {
    return this.update({ minProperties })
  }

  maxProperties(maxProperties: number) {
    return this.update({ maxProperties })
  }

  /*----------------
   * Array
   *----------------*/
  items<Schema extends SchemaInput>(items: Schema)
    : Update<K, Keyword.Items<SchemaKeyword<Schema>>>['calc']

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, Keyword.ItemsTuple<SchemaKeywordsArray<Schemas>>>['calc']
  
  items(...items: SchemaInput[])  {
    return this.update<any>({ items: items.length < 2 ? jsonValue(items[0]) : items.map(x => jsonValue(x)) })
  }

  maxItems(maxItems: number) {
    return this.update({ maxItems })
  }

  contains(contains: SchemaInput) {
    return this.update({ contains: jsonValue(contains) })
  }

  uniqueItems(uniqueItems: boolean) {
    return this.update({ uniqueItems })
  }

  minItems(minItems: number) {
    return this.update({ minItems })
  }

  additionalItems(value: boolean | SchemaInput) {
    return this.update({ additionalItems: typeof value === 'boolean' ? value : jsonValue(value) })
  }

  /*----------------
   * Number
   *----------------*/
  minimum(minimum: number) {
    return this.update({ minimum })
  }

  maximum(maximum: number) {
    return this.update({ maximum })
  }

  exclusiveMaximum(exclusiveMaximum: number | boolean) {
    return this.update({ exclusiveMaximum })
  }

  exclusiveMinimum(exclusiveMinimum: number | boolean) {
    return this.update({ exclusiveMinimum })
  }

  multipleOf(multipleOf: number) {
    return this.update({ multipleOf })
  }


  /*----------------
   * String
   *----------------*/
  format(format: string) {
    return this.update({ format })
  }

  pattern(pattern: RegExp) {
    const p = pattern.toString()
    return this.update({ pattern: p.substring(1, p.length - 1) })
  }

  minLength(minLength: number) {
    return this.update({ minLength })
  }

  maxLength(maxLength: number) {
    return this.update({ maxLength })
  }
}

export function is(): Schema<{ }> ;
export function is<T extends JsonTypeName>(...type: T[]): Schema<{ type: T }> ;
export function is<Props extends {[key: string]: SchemaInput}>(type: 'object', props: Props)
  : Schema<
    Keyword.Type<'object'> &
    Keyword.Properties<{[P in keyof Props]: SchemaKeyword<Props[P]>}> &
    Keyword.Required<Extract<keyof Props, string>> &
    Keyword.AdditionalPropertiesFalse
  > ;
export function is<K extends Keywords>(...type: (JsonTypeName |{[key: string]: SchemaInput}) []): Schema<K> { 
  if (type.length === 0) {
    return new Schema<any>({})
  }
  if (type.length === 1 && typeof type[0] === 'string') {
    return new Schema<any>({ type: type[0] })
  }
  if (type.length === 2 && type[0] === 'object' && typeof type[1] !== 'string') {
    return new Schema<any>({ type: 'object' })
      .properties(type[1])
      .required(...Object.keys(type[1]))
      .additionalProperties(false)
  }
  return new Schema<any>({ type: type as string[] })
}

const root = is()
is.title = root.title.bind(root)
is.description = root.description.bind(root)
is.default = root.default.bind(root)
is.example = root.example.bind(root)
is.const = root.const.bind(root)
is.enum = root.enum.bind(root)
is.oneOf = root.oneOf.bind(root)
is.anyOf = root.anyOf.bind(root)
is.allOf = root.allOf.bind(root)
is.not = root.not.bind(root)
is.properties = root.properties.bind(root)
is.required = root.required.bind(root)
is.additionalProperties = root.additionalProperties.bind(root)
is.dependencies = root.dependencies.bind(root)
is.patternProperties = root.patternProperties.bind(root)
is.minProperties = root.minProperties.bind(root)
is.maxProperties = root.maxProperties.bind(root)
is.items = root.items.bind(root)
is.maxItems = root.maxItems.bind(root)
is.contains = root.contains.bind(root)
is.uniqueItems = root.uniqueItems.bind(root)
is.minItems = root.minItems.bind(root)
is.additionalItems = root.additionalItems.bind(root)
is.minimum = root.minimum.bind(root)
is.maximum = root.maximum.bind(root)
is.exclusiveMaximum = root.exclusiveMaximum.bind(root)
is.exclusiveMinimum = root.exclusiveMinimum.bind(root)
is.multipleOf = root.multipleOf.bind(root)
is.format = root.format.bind(root)
is.pattern = root.pattern.bind(root)
is.minLength = root.minLength.bind(root)
is.maxLength = root.maxLength.bind(root)

export type is<T extends Schema<any>> = T['_T']
