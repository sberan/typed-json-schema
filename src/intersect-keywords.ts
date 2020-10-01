import { AnyJson, AnyJsonArray, AnyJsonObject, JsonObject } from "./json"
import { UnionToIntersection } from "./util"

export type JSONTypeName = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'

export type Keywords = Partial<
  TypeKeyword<JSONTypeName>
  & ConstKeyword<AnyJson>
  & EnumKeyword<AnyJson>
  & PropertiesKeyword<{ [key: string]: Keywords }>
  & RequiredKeyword<string>
> & {
  // can't put these in the intersection as above because circular refs (TS 4.1?)
  items?: Keywords | Keywords[]
  additionalProperties?: { false?: false, type?: Keywords }
} 

export type TypeKeyword<TypeName extends JSONTypeName> =
  { type: TypeName }

export type ConstKeyword<Const extends AnyJson> =
  { const: Const }

export type EnumKeyword<Enum extends AnyJson> =
  { enum: Enum }

export type PropertiesKeyword<Properties extends { [key: string]: Keywords }> =
  { properties: Properties }

export type RequiredKeyword<Required extends string> =
  { required: { [P in Required]?: true } }

export type ItemsKeyword<Items extends Keywords | Keywords[]> =
  { items: Items }

export type AdditionalPropertiesKeywordFalse =
  { additionalProperties: { false: false } }

export type AdditionalPropertiesKeywordType<Type extends Keywords> =
  { additionalProperties: { type: Type } }

type JsonObjectSpec<T extends Keywords> =
  (
    T extends PropertiesKeyword<infer Properties>
      ? { properties: { [P in keyof Properties]: TypeOf<Properties[P]> } }
      : { }
  ) & (
    T extends RequiredKeyword<infer Required>
      ? { required: Required }
      : { }
  ) & (
    T extends AdditionalPropertiesKeywordFalse
      ? { additionalProperties: false }
      : T extends AdditionalPropertiesKeywordType<infer K>
        ? { additionalProperties: K extends Keywords ? { type: TypeOf<K> } : never }
        : { }
  )

type JsonObjectValue<T extends Keywords> =
  Extract<keyof T, 'properties' | 'additionalProperties' | 'required'> extends never
  ? AnyJsonObject
  : JsonObject<{ [P in keyof JsonObjectSpec<T>]: JsonObjectSpec<T>[P] }>

export type TypeOf<K extends Keywords> = K extends infer Entry
  ? Entry extends never ? never
  : Entry extends ConstKeyword<infer Const> ? Const
  : Entry extends EnumKeyword<infer Enum> ? Enum
  : Entry extends TypeKeyword<infer TypeName>
    ? TypeName extends string //TODO need this check?
      ? 'string' extends TypeName ? string
      : 'boolean' extends TypeName ? boolean
      : 'number' extends TypeName ? number
      : 'null' extends TypeName ? null
      : 'object' extends TypeName ? JsonObjectValue<K>
      : 'array' extends TypeName ? AnyJsonArray
      : never
    : never
  : never
: never

export type AnyOfKeyword<AnyOf extends Keywords> =
  { anyOf: AnyOf }

export type AllOf<K extends AnyOfKeyword<Keywords>> = //TODO I think we can greatly simplify this using an array
  UnionToIntersection<K> extends { 'anyOf': Keywords }
    ? UnionToIntersection<K>['anyOf'] extends infer I ? I extends Keywords ? {[P in keyof I]: I[P]} : never : never
    : never
