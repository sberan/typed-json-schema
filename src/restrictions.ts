import { AnyJson, AnyJsonArray, JSONTypeName } from "./json";
import {  } from "./keywords";

type JsonTypeName = 'null' |'string' |'number' |'boolean' |'object' |'array'

export type Keywords = {
  type?: JSONTypeName
  const?: AnyJson
  properties?: {[key: string]: Keywords }
  required?: string
  additionalProperties?: boolean | Keywords
  items?: Keywords
}


type JsonSpec = {
  type?: JSONTypeName
  items?: JsonSpec
  object?: {
    properties?: {
      [key: string]: JsonSpec
    }
    required?: string
    only?: string
  }
}

type StringValue<Spec extends JsonSpec> = 'string' extends TypeKeyword<Spec> ? string : never

type NumberValue<Spec extends JsonSpec> = 'number' extends TypeKeyword<Spec> ? number : never

type BooleanValue<Spec extends JsonSpec> = 'boolean' extends TypeKeyword<Spec> ? boolean : never

type NullValue<Spec extends JsonSpec> = 'null' extends TypeKeyword<Spec> ? null : never

type ArrayValue<Spec extends JsonSpec> = 
  Spec extends { type: 'array' }
    ? Spec extends { items: JsonSpec }
      ? JsonValue<Spec['items']>[]
      : AnyJsonArray
    : never

type X = JsonValue<{ type: 'string' | 'number' }>

type JsonValue<Spec extends JsonSpec> =
    (Spec extends { type: 'null' } ? null : never)
  | (Spec extends { type: 'string' } ? string : never)
  | (Spec extends { type: 'number' } ? number : never)
  | (Spec extends { type: 'boolean'} ? boolean : never)
  | ArrayValue<Spec>