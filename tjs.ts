export type AnyJsonPrimitive = string | number | boolean | null 
export type AnyJsonObject = { [key: string]: AnyJson }
export type AnyJsonArray = AnyJson[]
export type AnyJson = AnyJsonPrimitive | AnyJsonArray | AnyJsonObject

export type JsonObject<RequiredFields extends string, T extends AnyJsonObject> = 
  {[key: string]: AnyJson}
  & {[P in Exclude<keyof T, RequiredFields>]?: Exclude<T[P], undefined> }
  & {[P in Extract<keyof T, RequiredFields>]: Exclude<T[P], undefined> }


type ExtractBoth<A, B, X> = X extends A ? X extends B ? X : never : never

type BothArrays<A, B> =
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

type BothOf<A, B> = { 0: 
  ExtractBoth<A, B, AnyJsonPrimitive> 
  | BothArrays<A, B>
}[0]


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
  type?: TypeNameDef | TypeNameDef[]
  items?: SchemaDef
  properties?: { [key: string]: SchemaDef }
  oneOf?: [SchemaDef, ...SchemaDef[]]
  anyOf?: [SchemaDef, ...SchemaDef[]]
  allOf?: [SchemaDef, ...SchemaDef[]]
  required?: readonly [string, ... readonly string[]]
}

type ArrayTypeOf<S extends SchemaDef> =
  S extends { items: infer T } ? Array<TypeOf<T>> : AnyJsonArray

type ObjectTypeOf<S extends SchemaDef> = 
  S extends { properties: infer PropTypes } ? JsonObject<S extends { required: ReadonlyArray<infer R> } ? R extends string ? R : '' : '', { [P in keyof PropTypes]: TypeOf<PropTypes[P]>}> : AnyJsonObject

type OneOfTypeOf<S extends SchemaDef> =
  S extends { oneOf: infer T} ? {[P in keyof T]: TypeOf<T[P]>}[Extract<keyof T, number>]
  : AnyJson

type AnyOfTypeOf<S extends SchemaDef> =
  S extends { anyOf: infer T} ? {[P in keyof T]: TypeOf<T[P]>}[Extract<keyof T, number>]
  : AnyJson

type BaseTypeOf<S extends SchemaDef> = 
  S extends TypeNameDef ? S :
  S extends { type: Array<infer Name> } ? Name :
  S extends { type: infer Name } ? Name :
  TypeNameDef

type TypeOf<S extends SchemaDef> = BothOf<
  BaseTypes<S>[BaseTypeOf<S>], 
  BothOf<OneOfTypeOf<S>, AnyOfTypeOf<S>>
>

export function validate<S extends SchemaDef>(schema: S ) : TypeOf<S> {
  throw 'nope'
}
