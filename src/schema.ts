import { AnyJsonArray, AnyJson } from './json'
import { Keyword, JsonTypeName, Keywords, TypeOf, Invert } from './keywords'
import { IntersectItems } from './util'

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
  'calc': Schema<{ [P in keyof (K & U)]: (K & U)[P] }>
}

export interface Schema<K extends Keywords> {
  _T: TypeOf<K>
  _K: K

  toJSON(): AnyJson
  
  /*----------------
   * Generic 
   *----------------*/

  title(title: string): Schema<K>

  description(description: string): Schema<K>

  default(value: AnyJson): Schema<K>

  example(example: string): Schema<K>
  
  const<Const extends AnyJson>(c: Const)
    : Update<K, Keyword.Const<Const>>['calc']

  enum<Enum extends AnyJsonArray>(...items: Enum)
    : Update<K, Keyword.Enum<Enum[number]>>['calc']

  oneOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Schema<SchemaDifference<K, SchemaKeywordsArray<Schemas>>[number]>

  anyOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Schema<SchemaUnion<K, Schemas>>

  allOf<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, SchemaIntersection<Schemas>>['calc']
  
  not<Input extends SchemaInput>(not: Input) : Schema<Invert<SchemaKeyword<Input>>>

  /*----------------
   * Object 
   *----------------*/

  properties<Properties extends {[key: string]: SchemaInput}>(props: Properties)
    : Update<K, Keyword.Properties<{ [P in keyof Properties]: SchemaKeyword<Properties[P]> }>>['calc']

  required<Keys extends string>(...k: Keys[])
    : Update<K, Keyword.Required<Keys>>['calc']

  additionalProperties<T extends boolean | SchemaInput>(additionalProperties: T)
    : Update<K,
      T extends false ? Keyword.AdditionalPropertiesFalse
      : T extends SchemaInput ? Keyword.AdditionalPropertiesType<SchemaKeyword<T>>
      : { }
    >['calc']

  dependencies(dependencies: {[key:string]: SchemaInput | string[]}): Schema<K>

  patternProperties(values:  {[key:string]: SchemaInput | string[]}): Schema<K>

  minProperties(minProperties: number): Schema<K>

  maxProperties(maxProperties: number): Schema<K>

  /*----------------
   * Array
   *----------------*/
  items<Schema extends SchemaInput>(items: Schema)
    : Update<K, Keyword.Items<SchemaKeyword<Schema>>>['calc']

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, Keyword.ItemsTuple<SchemaKeywordsArray<Schemas>>>['calc']

  items<Schemas extends SchemaInput[]>(...items: Schemas)
    : Update<K, Keyword.Items<SchemaKeywords<Schemas>>>['calc']

  maxLength(maxLength: number): Schema<K>

  maxItems(maxItems: number): Schema<K>

  contains(contains: string): Schema<K>

  uniqueItems(uniqueItems: boolean): Schema<K>

  minItems(minItems: number): Schema<K>

  additionalItems(additionalItems: boolean | SchemaInput): Schema<K>

  /*----------------
   * Number
   *----------------*/
  minimum(minimum: number): Schema<K>

  maximum(maximum: number): Schema<K>

  exclusiveMaximum(exclusiveMaximum: number | boolean): Schema<K>

  exclusiveMinimum(exclusiveMinimum: number | boolean): Schema<K>

  multipleOf(multipleOf: number): Schema<K>


  /*----------------
   * String
   *----------------*/
  format(format: string): Schema<K>

  pattern(pattern: RegExp): Schema<K>

  minLength(minLength: number): Schema<K>
}

export function is(): Schema<{ }> ;
export function is<T extends JsonTypeName>(...spec: T[]): Schema<{ type: T }> ;
export function is<K extends Keywords>(spec?: JsonTypeName | JsonTypeName[]): Schema<K>
{ throw 'nope' }

export type is<T extends Schema<any>> = T['_T']