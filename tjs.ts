import { Object, List, Union, Any, M } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonObject = {[key: string]: AnyJson }
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray


type JsonTypes = {
  string: string
  number: number
}

interface JsonSchema {
  type?: keyof JsonTypes 
}

type TypeKeyword<S extends keyof JsonTypes> = { type: S }

type JsonSchemaInput = JsonSchema | keyof JsonTypes

export type TypeOf<S extends JsonSchemaInput> = 
    S extends keyof JsonTypes ? JsonTypes[S]
  : S extends TypeKeyword<infer T> ? JsonTypes[T]
  : AnyJson


export function validate<S extends JsonSchemaInput>(schema: S): TypeOf<S> { throw 'nope'}
