import { AnyJson, AnyJsonArray, AnyJsonObject, JsonObject } from "./json"

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

export type Keywords = Partial<
  Keyword.Type<JsonTypeName>
  & Keyword.Const<AnyJson>
  & Keyword.Enum<AnyJson>
  & Keyword.Properties<{ [key: string]: Keywords }>
  & Keyword.Required<string>
> & {
  items?: Keywords | Keywords[]
  additionalProperties?: { false?: false, type?: Keywords }
} 

type JsonObjectSpec<T extends Keywords> =
  (
    T extends Keyword.Properties<infer Properties>
      ? { properties: { [P in keyof Properties]: TypeOf<Properties[P]> } }
      : { }
  ) & (
    T extends Keyword.Required<infer Required>
      ? { required: Required }
      : { }
  ) & (
    T extends Keyword.AdditionalPropertiesFalse
      ? { additionalProperties: false }
      : T extends Keyword.AdditionalPropertiesType<infer K>
        ? { additionalProperties: K extends Keywords ? { type: TypeOf<K> } : never }
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
  
export type TypeOf<K extends Keywords> = K extends infer Entry
  ? Entry extends never ? never
  : Entry extends Keyword.Const<infer Const> ? Const
  : Entry extends Keyword.Enum<infer Enum> ? Enum
  : Entry extends Keyword.Type<infer TypeName>
    ? TypeName extends string
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
