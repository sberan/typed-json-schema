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

type PropertiesTypeOf<A> =
  A extends JsonObject<infer ASpec>
    ? ASpec extends { properties: infer AProperties }
      ? AProperties extends AnyJsonObject
        ? AProperties
        : never
      : never
    : never

type BothJsonObjects<A, B> = 
  A extends AnyJsonPrimitive
    ? never
    : A extends AnyJsonArray
      ? never
      : AnyJsonObject extends A
        ? AnyJsonObject extends B
          ? AnyJsonObject
          : B extends AnyJsonObject
            ? B
            : never
        : AnyJsonObject extends B
          ? A extends AnyJsonObject
            ? A
            : never
          : A extends JsonObject<infer ASpec>
            ? ASpec extends { properties: infer AProperties }
              ? AProperties extends AnyJsonObject
                ? B extends JsonObject<infer BSpec>
                  ? BSpec extends { properties: infer BProperties}
                    ? BProperties extends AnyJsonObject
                      ? JsonObject<{
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
                      }>
                      : never
                    : never
                  : never
                : never
              : never
            : never
            // // ? B extends JsonObject<infer BProperties>
            //   // ? JsonObject<{
            //   //   properties: {
            //   //     [P in (keyof AProperties | keyof BProperties)]:
            //   //       P extends keyof AProperties
            //   //         ? P extends keyof BProperties
            //   //           ? BothOf<AProperties[P], BProperties[P]>
            //   //           : AProperties[P]
            //   //         : P extends keyof BProperties
            //   //           ? BProperties[P]
            //   //           : never
            //   //   }
            //   // }>
            //   ? AProps
            //   : A
            // : 4
          

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
  type?: TypeNameDef | readonly TypeNameDef[]
  items?: SchemaDef
  properties?: { [key: string]: SchemaDef }
  oneOf?: [SchemaDef, ...SchemaDef[]]
  anyOf?: [SchemaDef, ...SchemaDef[]]
  allOf?: [SchemaDef, ...SchemaDef[]]
  required?: readonly [string, ... readonly string[]]
}

type ArrayTypeOf<S extends SchemaDef> =
  S extends { items: infer T } ? Array<TypeOf<T>> : AnyJsonArray

export type JsonObject<S extends { properties: AnyJsonObject, required?: string, additionalProperties?: boolean}> = 
  (S extends { additionalProperties: false }
    ? { }
    : { [key: string]: AnyJson })
  & (S extends { required: string }
    ? {[P in Exclude<keyof S['properties'], S['required']>]?: Exclude<S['properties'][P], undefined> }
    : {})
  & {[P in Extract<keyof S['properties'], S['required']>]: Exclude<S['properties'][P], undefined> }

type Simplify<T> = {'1': {[P in keyof T]: T[P]}}['1']

type ObjectTypeOf<S extends SchemaDef> =
  S extends { properties: infer PropTypes }
    ? PropTypes extends {[key: string]: SchemaDef}
      ? JsonObject<Simplify<
        { properties: {[P in keyof PropTypes]: TypeOf<PropTypes[P]> } }
        & (S extends { required: ReadonlyArray<infer S> } ? { required: S } : {})
        & (S extends { additionalProperties: false } ? { additionalProperties: false} : {})
      >>
      : AnyJsonObject
    : AnyJsonObject

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
