import { AnyJson, AnyJsonArray, AnyJsonObject, AnyJsonValue, JsonObject } from "./json"
import { JSONTypeName } from "./json-type-of"
import { UnionToIntersection } from "./util"

export type Keywords = Partial<
  TypeKeyword<JSONTypeName>
  & ConstKeyword<AnyJson>
  & EnumKeyword<AnyJson>
  & PropertiesKeyword<{[key: string]: Keywords}>
  & RequiredKeyword<string>
> & {
  items?: Keywords //TODO: tuple type (with tests). can't put this in the partial because circular refs
  additionalProperties?: {true?: true, false?: false, keywords?: Keywords }
  anyOf?: Keywords
} 

type TypeKeyword<TypeName extends string> =
  { type: {[P in TypeName]?: true} }

type ConstKeyword<Const extends AnyJson> =
  { const: Const }

type EnumKeyword<Enum extends AnyJson> =
  { enum: Enum }

type PropertiesKeyword<Properties extends {[key: string]: Keywords }> =
  { properties: Properties }

type RequiredKeyword<Required extends string> =
  { required: {[P in Required]: true} }



type JsonObjectSpec<T extends Keywords> =
  Extract<keyof T, 'properties' | 'additionalProperties' | 'required'> extends never
  ? AnyJsonObject
  : T extends PropertiesKeyword<infer Properties>
    ? {[P in keyof Properties]: TypeOf<Properties[P]> }
    : {}

type NodeEntries<K> = {[P in keyof K]: {[P2 in P]: K[P2]}}[keyof K]

export type TypeOf<K extends Keywords> = K extends infer Entry
  ? Entry extends ConstKeyword<infer Const>
    ? Const
    : Entry extends { type: infer TypeValues }
      ? NodeEntries<TypeValues> extends infer Type
        ? Type extends { string: true } ? string
        : Type extends { boolean: true } ? boolean
        : Type extends { number: true } ? number
        : Type extends { null: true } ? null
        : Type extends { object: true } ? JsonObjectSpec<K>
        : Type extends { array: true } ? AnyJsonArray
        : never
      : never
    : never
  : never

export type AllOf<K extends Keywords> =
  UnionToIntersection<K> extends { 'anyOf': Keywords}
    ? UnionToIntersection<K>['anyOf'] extends infer I ? I extends Keywords ? {[P in keyof I]: I[P]} : never : never
    : never

type StringOrNumberUnion = TypeOf<{ type: {string: true} } | { type: {number: true} }>
type StringOrNumberNode = TypeOf<{ type: {string: true, number: true} }>
type Const42Node = TypeOf<{ const: 42, type: {string: true} }> //TODO this should technically be never
type Object = TypeOf<{ type: { object: true }}>
type ObjectAString = TypeOf<{ type: { object: true }, properties: { a: { type: { string: true } } } }>
