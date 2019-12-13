import { List, Object } from 'ts-toolbelt'

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

type PropertyTypesOf<P extends AnyJsonObject, R extends string, A extends boolean > = { properties: P, required?: string extends R ? never : R, additionalProperties?: A }

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


type BothJsonObjects<A, B> = 
  A extends AnyJsonPrimitive
    ? never
    : A extends AnyJsonArray
      ? never
      : A extends JsonObject<infer ASpec>
        ? ASpec extends PropertyTypesOf<infer AProperties, infer ARequired, infer AAdditional>
          ? B extends JsonObject<infer BSpec>
            ? BSpec extends PropertyTypesOf<infer BProperties, infer BRequired, infer BAdditional>
              ? JsonObject<Simplify<{
                  properties: {
                    [P in (keyof AProperties | keyof BProperties)]:
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

type AllOf<A extends AnyJsonArray, Acc = AnyJson> =
    A extends [infer A1] ? BothOf<A1, Acc>
  :  {"0": 
        AllOf<List.Tail<A>, BothOf<List.Head<A>, Acc>>
     }[A extends 1 ? "0" : "0"]

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

type TypeOf<S extends SchemaDef> = BothOf<
  BaseTypes<S>[BaseTypeOf<S>], 
  BothOf<
    OneOfTypeOf<S>,
    BothOf<
      AnyOfTypeOf<S>,
      AllOfTypeOf<S>
    >
  >
>

type RequireReadOnly<T> =
  T extends object 
    ? Object.WritableKeys<T> extends never
      ? T
      : never
    : T

function foo<T extends Object>(o: T): RequireReadOnly<T> {
  throw 'nope'
}

const x = foo({ a: 42 })

export function validate<S extends SchemaDef>(schema: S ) : TypeOf<RequireReadOnly<S>> {
  throw 'nope'
}
