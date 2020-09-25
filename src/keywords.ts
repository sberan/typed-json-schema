import { AnyJson, AnyJsonArray, AnyJsonObject, JsonObject } from "./json"

type OmitUndefined<T> = Omit<T, {[P in keyof T]: T[P] extends undefined ? P : never }[keyof T]>

export type JSONTypeName = 'null' |'string' |'number' |'boolean' |'object' |'array'

export type Keywords = {
  type?: JSONTypeName
  const?: AnyJson
  properties?: {[key: string]: Keywords }
  required?: string
  additionalProperties?: boolean | Keywords
  items?: Keywords
  oneOf?: Keywords[]
}

type ItemsKeyword<Items extends Keywords> = { items: Items }
type TypeKeyword<K extends Keywords> = K extends { type: JSONTypeName } ? K['type'] : JSONTypeName
type PropertiesKeyword<Properties extends {[key: string]: Keywords}> = { properties: {} extends Properties ? never : Properties }
type PropertyValue<Key extends string, Value extends Keywords> = { properties: {[P in Key]: Value} }
type RequiredKeyword<Required extends string> = { required: Required }
type AdditionalPropertiesKeyword<AdditionalProperties extends false | Keywords> = { additionalProperties: AdditionalProperties }
type ConstKeyword<T extends AnyJson> = { const: T }

// type PopulatedElementIndexes<Ks extends Keywords[], Key extends keyof Keywords> = {[I in keyof Ks]: Key extends keyof Ks[I] ? I : never}[number]
// type KeywordValues<Ks extends Keywords[], Key extends keyof Keywords> =
//   {[I in PopulatedElementIndexes<Ks, Key>]: 42}

// type TypeIntersection<T extendsasdf
type CombineTypes<Ks extends Keywords[]> =
  Exclude<JSONTypeName, {[I in keyof Ks]: Ks[I] extends { type: infer T } ? Exclude<JSONTypeName, T> : never }[number]>

type ConstValues<Ks extends Keywords[]> =
  {[I in keyof Ks]: Ks[I] extends ConstKeyword<infer C> ? C : never }

type Equals<A, B> = A extends never ? never 
  : B extends never ? never 
  : A extends B
    ? B extends A 
      ? true 
      : false
    : false

type AllEquals<Ks extends AnyJson[]> = {[I in keyof Ks]: {[J in keyof Ks]: Equals<Ks[I], Ks[J]> }[number]}[number]
type CombineConsts<Ks extends AnyJson[]> = false extends AllEquals<Ks> ? never : Ks[number]

type AllPropertyKeys<Ks extends Keywords[]> = {[I in keyof Ks]: Ks[I] extends PropertiesKeyword<infer Props> ? Extract<keyof Props, string> : never}[number]

type CombinePropertyValues<Ks extends Keywords[], Key extends string> = AllKeywords<{[I in keyof Ks]: Ks[I] extends PropertyValue<Key, infer Value> ? Value : {} }>['calc']

type AllKeywords<Ks extends Keywords[]> = {
  'calc': Pick<{
    type: CombineTypes<Ks>
    const: CombineConsts<ConstValues<Ks>>
    properties: {[P in AllPropertyKeys<Ks>]: CombinePropertyValues<Ks, P>}
    required: Ks[0]['required']
    additionalProperties: Ks[0]['additionalProperties']
    items: Ks[0]['items']
    oneOf: Ks[0]['oneOf']
  }, {[I in keyof Ks]: Extract<keyof Ks[I], keyof Keywords>}[number]>
}

type PropertiesSpec<Properties extends {[key: string]: Keywords}> = {
  calc: {[P in keyof Properties]: JsonValue<Properties[P]>['calc']}
}

type AdditionalPropertiesSpec<AdditionalProperties extends false | Keywords> =
  AdditionalProperties extends Keywords ? { type: JsonValue<AdditionalProperties>['calc'] } : false

type JsonObjectSpec<K extends Keywords> = OmitUndefined<{
  properties: K extends PropertiesKeyword<infer Properties> ? PropertiesSpec<Properties>['calc'] : undefined
  required: K extends RequiredKeyword<infer Required> ? Required : undefined
  additionalProperties: K extends AdditionalPropertiesKeyword<infer AdditionalProperties> ? AdditionalPropertiesSpec<AdditionalProperties> : undefined
}>

type StringValue<K extends Keywords> = 'string' extends TypeKeyword<K> ? string : never

type NumberValue<K extends Keywords> = 'number' extends TypeKeyword<K> ? number : never

type BooleanValue<K extends Keywords> = 'boolean' extends TypeKeyword<K> ? boolean : never

type NullValue<K extends Keywords> = 'null' extends TypeKeyword<K> ? null : never

type ObjectValue<K extends Keywords> =
  'object' extends TypeKeyword<K>
    ? keyof JsonObjectSpec<K> extends never
      ? AnyJsonObject
      : JsonObject<{[P in keyof JsonObjectSpec<K>]: JsonObjectSpec<K>[P]}>
    : never

type ArrayValue<K extends Keywords> =
  'array' extends TypeKeyword<K>
    ? K extends ItemsKeyword<infer Items>
      ? JsonValue<Items>['calc'][]
      : AnyJsonArray
    : never

type RootValue<K extends Keywords> =
  K extends ConstKeyword<infer Const> ? Const
    : StringValue<K> | BooleanValue<K> | NumberValue<K> | NullValue<K> | ObjectValue<K> | ArrayValue<K>

type OneOfKeyword<OneOf extends Keywords[]> = { oneOf: OneOf }

type OneOfValue<K extends Keywords> =
  K extends OneOfKeyword<infer OneOf> ? {[I in keyof OneOf]: AllKeywords<[K, OneOf[I]]>['calc']}[number] : K

type JsonValue<K extends Keywords> = {
  calc: keyof K extends never ? AnyJson
  : RootValue<OneOfValue<K>>
}

export type TypeOf<K extends Keywords> = JsonValue<K>['calc']