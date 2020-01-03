import { Object, List, Union, Any, M } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonObject = {[key: string]: AnyJson }
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray


type TypeName = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'

type JsonSchemaInput = TypeName | {
  type?: TypeName | ReadonlyArray<TypeName>
  items?: JsonSchemaInput
  allOf?: ReadonlyArray<JsonSchemaInput>
}

type SingleTypeName<S extends TypeName> = { type: S }
type MultiTypeName<S extends TypeName> = { type: ReadonlyArray<S> }

type JsonSchemaSpec = {
  type: TypeName
  items: JsonSchemaSpec
}

type SpecOf<S extends JsonSchemaInput> = {
  type: S extends TypeName ? S
      : S extends SingleTypeName<infer T> ? T
      : S extends MultiTypeName<infer T> ? T
      : TypeName
  items: S extends { items: infer I } ? SpecOf<I> : JsonSchemaSpec
} & (
  S extends { allOf: infer T }
    ? Union.IntersectOf<{[P in keyof T]: SpecOf<T[P]>}[Extract<keyof T, number>]>
    : {}
)

type TypeOf<S extends JsonSchemaSpec> = {} extends S ? AnyJson : {
  string: string
  number: number
  boolean: boolean
  null: null
  array: S extends { items: infer I }
    ? I extends JsonSchemaSpec
      ? JsonSchemaSpec extends I
        ? AnyJsonArray
        : TypeOf<I>[]
      : AnyJsonArray
    : AnyJsonArray
  object: AnyJsonObject
}[S['type']]

export function validate<S extends JsonSchemaInput>(schema: S): TypeOf<SpecOf<S>> { throw 'nope'}

function specOf<S extends JsonSchemaInput>(): Any.Compute<SpecOf<S>> { throw 'nope'}

const x = specOf<{
  allOf: [
    { items: { type: ['string', 'number'] } } ,
    { items: { type: ['number', 'object'] } } ,
  ]
}>()