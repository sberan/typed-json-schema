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

export type TypeOf<S extends JsonSchemaInput> = 
    S extends TypeName ? JsonTypes[S]
  : S extends SingleTypeName<infer T> ? JsonTypes[T]
  : S extends MultiTypeName<infer T> ? JsonTypes[T]
  : AnyJson


export function validate<S extends JsonSchemaInput>(schema: S): TypeOf<S> { throw 'nope'}
