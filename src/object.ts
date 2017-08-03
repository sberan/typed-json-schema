import { Schema, Props } from "./schema";

type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
type AnyRequired<K extends string> = {[P in K]: any }

export class ObjectSchema<P, K extends string, A, PatternProperties, Dependencies>
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

  properties <O> (properties: {[ P in keyof O ]: Schema<O[P]>}) {
    const props = Object.keys(properties).reduce<Props>((acc, key) => {
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

  patternProperties <T> (patternProperties: {[key: string]: Schema<T>}) {
    const props = Object.keys(patternProperties).reduce<Props>((acc, key) => {
      acc[key] = patternProperties[key].props
      return acc
    }, {})
    return this.setProps({ patternProperties: props }) as any as ObjectSchema<P, K, A, {[key: string]: T}, Dependencies>
  }

  dependencies (dependencies: {[key: string]: Schema<any> | string[]}) {
    const props = Object.keys(dependencies).reduce<Props>((acc, key) => {
      const value = dependencies[key]
      if (Array.isArray(value)) {
        acc[key] = value
      } else {
        acc[key] = value.props
      }
      return acc
    }, {})
    return this.setProps({ dependencies: props }) as any as ObjectSchema<P, K, A, PatternProperties, {[key: string]: any}>
  }

}
