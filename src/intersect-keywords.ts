import { AnyJson, AnyJsonArray, AnyJsonObject, AnyJsonValue, JsonObject } from "./json"
import { JSONTypeName } from "./json-type-of"
import { UnionToIntersection } from "./util"

export type Keywords = Partial<
  TypeKeyword<JSONTypeName>
  & ConstKeyword<AnyJson>
  & EnumKeyword<AnyJson>
  & PropertiesKeyword<{ [key: string]: Keywords }>
  & RequiredKeyword<string>
> & {
  // can't put this in the partial because circular refs (TS 4.1?)
  items?: Keywords | Keywords[]
  additionalProperties?: { true?: true, false?: false, keywords?: Keywords }
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
  { required: { [P in Required]: true } }

export type ItemsKeyword<Items extends Keywords | Keywords[]> =
  { items: Items }

type JsonObjectSpec<T extends Keywords> =
  Extract<keyof T, 'properties' | 'additionalProperties' | 'required'> extends never
  ? AnyJsonObject
  : JsonObject<
    T extends PropertiesKeyword<infer Properties>
      ? { properties: { [P in keyof Properties]: TypeOf<Properties[P]> } }
      : { }
    &  T extends RequiredKeyword<infer Required>
      ? { required: Required }
      : { }
  >

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
      : 'object' extends TypeName ? JsonObjectSpec<K>
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

type StringOrNumberUnion = TypeOf<TypeKeyword<'string' | 'number'>>
type StringOrNumberNode = TypeOf<TypeKeyword<'string'> | TypeKeyword<'number'>>
type Const42Node = TypeOf<ConstKeyword<42> & TypeKeyword<'string'>> //TODO this should technically be never
type Object = TypeOf<TypeKeyword<'object'>>
type ObjectAString = TypeOf<TypeKeyword<'object'> & PropertiesKeyword<{a: TypeKeyword<'string'> }>>
type StringByCombination = TypeOf<(TypeKeyword<'string'> | TypeKeyword<'number'>) & TypeKeyword<'string'> >