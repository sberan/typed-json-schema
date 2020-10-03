import { AnyJson, AnyJsonArray, AnyJsonObject, JsonObject, ObjectSpec } from "./json"
import { KeyedObject } from './util'

export type JsonTypeName = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'

export namespace Keyword {

  export type Type<TypeName extends JsonTypeName> =
    { type: TypeName }

  export type Const<Const extends AnyJson> =
    { const: Const }

  export type Enum<Enum extends AnyJson> =
    { enum: Enum }

  export type Properties<Properties extends { [key: string]: Keywords }> =
    { properties: Properties }

  export type Required<Required extends string> =
    { required: { [P in Required]?: true } }

  export type Items<Items extends Keywords> =
    { items: Items }

  export type ItemsTuple<ItemsTuple extends Keywords[]> =
    { items: ItemsTuple }

  export type AdditionalPropertiesFalse =
    { additionalProperties: { false: false } }

  export type AdditionalPropertiesType<Type extends Keywords> =
    { additionalProperties: { type: Type } }
}

export type Keywords = KeyedObject<[
  Keyword.Type<JsonTypeName>,
  Keyword.Const<AnyJson>,
  Keyword.Enum<AnyJson>,
  Keyword.Properties<{ [P in string]: Keywords }>,
  Keyword.Required<string>,
  Keyword.ItemsTuple<Keywords[]>,
  Keyword.Items<Keywords>,
  Keyword.AdditionalPropertiesFalse,
  Keyword.AdditionalPropertiesType<Keywords>
]>

type JsonObjectSpec<T extends Keywords> =
  (
    T extends Keyword.Properties<infer Properties>
      ? ObjectSpec.Properties<{ [P in keyof Properties]: TypeOf<Properties[P]> }>
      : { }
  ) & (
    T extends Keyword.Required<infer Required>
      ? ObjectSpec.Required<Required>
      : { }
  ) & (
    T extends Keyword.AdditionalPropertiesFalse
      ? ObjectSpec.AdditionalPropertiesFalse
      : T extends Keyword.AdditionalPropertiesType<infer K>
        ? K extends Keywords ? { additionalProperties: { type: TypeOf<K> } } : never
        : { }
  )

type JsonObjectValue<T extends Keywords> =
  Extract<keyof T, 'properties' | 'additionalProperties' | 'required'> extends never
  ? AnyJsonObject
  : JsonObject<{ [P in keyof JsonObjectSpec<T>]: JsonObjectSpec<T>[P] }>

type JsonArrayValue<K extends Keywords> =
  K extends Keyword.Items<infer Items>
    ? TypeOf<Items>[]
    : K extends Keyword.ItemsTuple<infer Items>
      ? { [I in keyof Items]: TypeOf<Items[I]> }
      : AnyJsonArray

type TypeNameOf<K extends Keywords> = K extends Keyword.Type<infer T> ? T : JsonTypeName

export type TypeOf<K extends Keywords> = K extends infer Entry
  ? Entry extends never ? never
  : Entry extends Keyword.Const<infer Const> ? Const
  : Entry extends Keyword.Enum<infer Enum> ? Enum
  : TypeNameOf<Entry> extends infer TypeName
    ? TypeName extends JsonTypeName
      ? 'string' extends TypeName ? string
      : 'boolean' extends TypeName ? boolean
      : 'number' extends TypeName ? number
      : 'null' extends TypeName ? null
      : 'object' extends TypeName ? JsonObjectValue<K>
      : 'array' extends TypeName ? JsonArrayValue<K>
      : never
    : never
  : never
: never
