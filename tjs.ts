import { Object, List, Union, Any, M } from 'ts-toolbelt'

export type AnyJsonPrimitive = string | number | boolean | null
export type AnyJsonObject = {[key: string]: AnyJson }
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonObject | AnyJsonArray

type JsonSchema = 'string' | {}

export type TypeOf<JsonSchema> = 
  JsonSchema extends 'string' ? string : AnyJsonObject


export function validate<S extends JsonSchema>(schema: S): TypeOf<S> { throw 'nope'}
