/*
import { List, Object, A } from 'ts-toolbelt'


export type AnyJsonPrimitive = string | number | boolean | null 
export type AnyJsonObject = { [key: string]: AnyJson }
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonArray | AnyJsonObject

type BothJsonPrimitives<A, B> =
  A extends AnyJsonPrimitive
    ? B extends AnyJsonPrimitive
      ? A extends B 
        ? A
        : B extends A
          ? B
          : never
      : never
    : never

type PropertyTypesOf<P extends AnyJsonObject, R extends string> = { properties: P, required?: string extends R ? never : R, additionalProperties?: boolean }

type Specify<T, S extends T> = T extends S ? never : S
type NonNull<T> = Exclude<T, undefined | null | void>

type BothAnyJsonObjects<A, B> =
  AnyJsonObject extends A
    ? AnyJsonObject extends B
      ? AnyJsonObject
      : B extends AnyJsonObject
        ? B
        : never
    : AnyJsonObject extends B
      ? A extends AnyJsonObject
        ? A
        : never
      : never

type JsonObjectSpec =  { properties: AnyJsonObject, required?: string, additionalProperties?: boolean }

type PropertyKeysOf<ASpec extends JsonObjectSpec, BSpec extends JsonObjectSpec> =
    Extract<keyof ASpec['properties'],  BSpec extends { additionalProperties: false } ? keyof BSpec['properties'] : string>
  | Extract<keyof BSpec['properties'],  ASpec extends { additionalProperties: false } ? keyof ASpec['properties'] : string>

type BothJsonObjects<A, B> = 
  A extends AnyJsonPrimitive
    ? never
    : A extends AnyJsonArray
      ? never
      : A extends JsonObject<infer ASpec>
        ? ASpec extends PropertyTypesOf<infer AProperties, infer ARequired>
          ? B extends JsonObject<infer BSpec>
            ? BSpec extends PropertyTypesOf<infer BProperties, infer BRequired>
              ? JsonObject<Simplify<{
                  properties: {
                    [P in PropertyKeysOf<ASpec, BSpec>]:
                      P extends keyof AProperties
                        ? P extends keyof BProperties
                          ? BothOf<AProperties[P], BProperties[P]>
                          : AProperties[P]
                        : P extends keyof BProperties
                          ? BProperties[P]
                          : never
                  }
                } & ((Specify<string, ARequired> | Specify<string, BRequired>) extends never ? {} : {
                  required: Specify<string, ARequired> | Specify<string, BRequired>
                })
                & (ASpec extends { additionalProperties: false } ? { additionalProperties: false } : {})
                & (BSpec extends { additionalProperties: false } ? { additionalProperties: false } : {})
                >>
              : keyof ASpec['properties'] extends never // B is AnyJsonObject
                ? AnyJsonObject
                : A
            : BothAnyJsonObjects<A, B>
          : B extends JsonObject<infer BSpec>
            ? keyof BSpec['properties'] extends never
              ? AnyJsonObject
              : B
            : BothAnyJsonObjects<A, B>
        : BothAnyJsonObjects<A, B>
          

type BothJsonArrays<A, B> =
  A extends AnyJsonArray
    ? B extends AnyJsonArray
      ? AnyJsonArray extends A
        ? AnyJsonArray extends B
          ? AnyJsonArray
          : Extract<B, AnyJsonArray>
        : AnyJsonArray extends B
          ? Extract<A, AnyJsonArray>
          : A extends Array<infer AT>
            ? B extends Array<infer BT>
              ? Array<BothOf<AT, BT>>
              : never
            : never
      : never
    : never

export type BothOf<A, B> = { 0: 
  BothJsonPrimitives<A, B> 
  | BothJsonArrays<A, B>
  | BothJsonObjects<A, B>
}[0]

type AllOf<A extends AnyJsonArray> =
    A extends [infer A1] ? A1
  : A extends [infer A1, infer A2] ? BothOf<A1, A2>
  : A extends [infer A1, infer A2, infer A3] ? BothOf<BothOf<A1, A2>, A3>
  : A extends [infer A1, infer A2, infer A3, infer A4] ? BothOf<BothOf<A1, A2>, BothOf<A3, A4>>
  : A extends [infer A1, infer A2, infer A3, infer A4, infer A5] ? BothOf<BothOf<BothOf<A1, A2>, BothOf<A3, A4>>, A5>
  : A extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6] ? BothOf<BothOf<BothOf<A1, A2>, BothOf<A3, A4>>, BothOf<A5, A6>>
  : A extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7] ? BothOf<BothOf<BothOf<A1, A2>, BothOf<A3, A4>>, BothOf<BothOf<A5, A6>, A7>>
  : A extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7, infer A8] ? BothOf<BothOf<BothOf<A1, A2>, BothOf<A3, A4>>, BothOf<BothOf<A5, A6>, BothOf<A7, A8>>>
  : never

interface BaseTypes<S extends SchemaDef> {
  string: string
  number: number
  boolean: boolean
  null: null
  array: ArrayTypeOf<S>
  object: ObjectTypeOf<S>
}

type TypeNameDef = keyof BaseTypes<{}>

type SchemaDef = TypeNameDef | {
  readonly type?: TypeNameDef | readonly TypeNameDef[]
  readonly items?: SchemaDef
  readonly properties?: { readonly [key: string]: SchemaDef }
  readonly oneOf?: readonly [SchemaDef, ...SchemaDef[]]
  readonly anyOf?: readonly [SchemaDef, ...SchemaDef[]]
  readonly allOf?: readonly [SchemaDef, ...SchemaDef[]]
  readonly required?: readonly [string, ... readonly string[]]
}

type ArrayTypeOf<S extends SchemaDef> =
  S extends { items: infer T } ? Array<TypeOf<T>> : AnyJsonArray

export type JsonObject<S extends { properties: AnyJsonObject, required?: string, additionalProperties?: boolean }> = 
  (S extends { additionalProperties: false } ? { } : { [key: string]: AnyJson })
  & {[P in Exclude<keyof S['properties'], Specify<string, NonNull<S['required']>>>]?: Exclude<S['properties'][P], undefined> }
  & {[P in Extract<keyof S['properties'], Specify<string, NonNull<S['required']>>>]: Exclude<S['properties'][P], undefined> }

type Simplify<T> = {'1': {[P in keyof T]: T[P]}}['1']

type ObjectTypeOf<S extends SchemaDef> =
  S extends { properties: infer PropTypes }
    ? PropTypes extends { readonly [key: string]: SchemaDef}
      ? JsonObject<Simplify<
        { properties: { -readonly [P in keyof PropTypes]: TypeOf<PropTypes[P]> } }
        & (S extends { required: ReadonlyArray<infer S> } ? { required: S } : {})
        & (S extends { additionalProperties: false } ? { additionalProperties: false} : {})
      >>
      : AnyJsonObject
    : AnyJsonObject

type OneOfTypeOf<S extends SchemaDef> =
  S extends { oneOf: infer T} ? {-readonly [P in keyof T]: TypeOf<T[P]>}[Extract<keyof T, number>]
  : AnyJson

type AnyOfTypeOf<S extends SchemaDef> =
  S extends { anyOf: infer T} ? {-readonly [P in keyof T]: TypeOf<T[P]>}[Extract<keyof T, number>]
  : AnyJson


type AllOfTypeOf<S extends SchemaDef> =
  S extends { allOf: infer T} ? AllOf<Extract<{-readonly [P in keyof T]: TypeOf<T[P]>}, AnyJsonArray>>
  : AnyJson

type BaseTypeOf<S extends SchemaDef> = 
  S extends TypeNameDef ? S :
  S extends { type: ReadonlyArray<infer Name> } ? Name :
  S extends { type: infer Name } ? Name :
  TypeNameDef

type ConstTypeOf<S extends SchemaDef> = S extends { const: AnyJson } ? S["const"] : AnyJson

type TypeOf<S extends SchemaDef> = BothOf<
  BothOf<
    BothOf<
      BaseTypes<S>[BaseTypeOf<S>], 
      ConstTypeOf<S>
    >,
    OneOfTypeOf<S>>,
  BothOf<
    AnyOfTypeOf<S>,
    AllOfTypeOf<S>>
>

type RequireReadOnly<T> =
  T extends object 
    ? Object.WritableKeys<T> extends never
      ? T
      : never
    : T

export function validate<S extends SchemaDef>(schema: S ) : TypeOf<RequireReadOnly<S>> {
  throw 'nope'
}
*/