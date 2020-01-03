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

type SpecOf<S extends JsonSchemaInput> = {
  type: Exclude<TypeName, S extends TypeName ? S
      : S extends SingleTypeName<infer T> ? T
      : S extends MultiTypeName<infer T> ? T
      : TypeName
      >
  items: S extends { items: infer I } ? SpecOf<I> : {}
} | (
  S extends { allOf: infer T }
    ? {[P in keyof T]: SpecOf<T[P]>}[Extract<keyof T, number>]
    : never
)

type JsonSchemaSpec = {
  type?: TypeName
  items?: JsonSchemaSpec
}

type SpecField<S extends JsonSchemaSpec, P extends keyof JsonSchemaSpec, Default extends JsonSchemaSpec[P]> = P extends keyof S ? Exclude<S[P], undefined> : Default

type TypeOf<S extends JsonSchemaSpec> = {} extends S ? AnyJson : {
  string: string
  number: number
  boolean: boolean
  null: null
  array: S extends { items: infer I } ? TypeOf<I>[] : AnyJsonArray
  object: AnyJsonObject
}[Exclude<TypeName, SpecField<S, 'type', never>>]

export function validate<S extends JsonSchemaInput>(schema: S): TypeOf<SpecOf<S>> { throw 'nope'}

function specOf<S extends JsonSchemaInput>(): Any.Compute<SpecOf<S>> { throw 'nope'}

const x = specOf<{
  allOf:[{ type: 'number'}]
}>()