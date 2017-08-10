import { Schema, JSONObject, AnyJSON } from "./schema";

type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
type AnyRequired<K extends string> = {[P in K]: AnyJSON }

export class ObjectSchema<P extends AnyRequired<keyof P>, K extends string, A extends JSONObject, PatternProperties, Dependencies>
    extends Schema<AnyRequired<Diff<K, keyof P>> //additional required properties typed with any
                   & Partial<Pick<P, Diff<keyof P, K>>> // properties not specified by requiredProperties
                   & Pick<P, Diff<keyof P, Diff<keyof P, K>>> // required properties
                   & A // additional properties
                   & PatternProperties
                   & Dependencies
                  >  {
  constructor () {
    super({ type: 'object' })
  }

  maxProperties (maxProperties: number) {
    return this.setProps({ maxProperties })
  }

  minProperties (minProperties: number) {
    return this.setProps({ minProperties })
  }

  properties <K extends keyof O, O extends {[ P in K ]: AnyJSON}> (properties: {[ P in keyof O ]: Schema<O[P]>}) {
    const props = Object.keys(properties).reduce<JSONObject>((acc, key) => {
      acc[key] = properties[key].props
      return acc
    }, {})
    return this.setProps({ properties: props }) as any as ObjectSchema<O, never, A, PatternProperties, Dependencies>
  }

  required <K extends string> (...required: K[]) {
    return this.setProps({ required }) as any as ObjectSchema<P, K, A, PatternProperties, Dependencies>
  }

  additionalProperties (additionalProperties: true): this
  additionalProperties (additionalProperties: false): ObjectSchema<P, K, {}, PatternProperties, Dependencies>
  additionalProperties (additionalProperties: boolean) {
    return this.setProps({ additionalProperties })
  }

  patternProperties (patternProperties: {[key: string]: Schema<AnyJSON>}) {
    const props = Object.keys(patternProperties).reduce<JSONObject>((acc, key) => {
      acc[key] = patternProperties[key].props
      return acc
    }, {})
    return this.setProps({ patternProperties: props }) as any as ObjectSchema<P, K, A, {[key: string]: AnyJSON }, Dependencies>
  }

  dependencies (dependencies: {[key: string]: Schema<AnyJSON> | string[]}) {
    const props = Object.keys(dependencies).reduce<JSONObject>((acc, key) => {
      const value = dependencies[key]
      if (Array.isArray(value)) {
        acc[key] = value
      } else {
        acc[key] = value.props
      }
      return acc
    }, {})
    return this.setProps({ dependencies: props }) as any as ObjectSchema<P, K, A, PatternProperties, {[key: string]: AnyJSON}>
  }

}
