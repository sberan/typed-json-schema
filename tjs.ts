import { Object, List, Union, Any, M } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonObject = {[key: string]: AnyJson }
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray


type JsonTypes = {
  string: string
  number: number
  boolean: boolean
  null: null
  array: AnyJsonArray
  object: AnyJsonObject
}

type TypeName = keyof JsonTypes

interface JsonSchema {
  type?: TypeName | ReadonlyArray<TypeName>
  allOf?: ReadonlyArray<JsonSchemaInput>
}

type SingleTypeName<S extends TypeName> = { type: S }
type MultiTypeName<S extends TypeName> = { type: ReadonlyArray<S> }

type JsonSchemaInput = JsonSchema | TypeName

type SpecOf<S extends JsonSchemaInput> = {
  type: Exclude<TypeName, S extends TypeName ? S
      : S extends SingleTypeName<infer T> ? T
      : S extends MultiTypeName<infer T> ? T
      : TypeName
      >
} | (
  S extends { allOf: infer T }
    ? {[P in keyof T]: SpecOf<T[P]>}[Extract<keyof T, number>]
    : never
)

type JsonSchemaSpec = {
  type: TypeName
}

type TypeOf<S extends JsonSchemaSpec> = JsonTypes[Exclude<TypeName, S['type']>]

export function validate<S extends JsonSchemaInput>(schema: S): TypeOf<SpecOf<S>> { throw 'nope'}

function specOf<S extends JsonSchemaInput>(): Any.Compute<SpecOf<S>> { throw 'nope'}

const x = specOf<{
  allOf:[{ type: 'number'}]
}>()