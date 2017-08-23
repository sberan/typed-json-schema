import { Schema, JSONObject, AnyJSON } from "./schema";

export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
export type AnyRequired<T extends AnyJSON, K extends string> = {[P in K]: AnyJSON }

export class ObjectSchema<
      PropertyDefinitions extends AnyRequired<AnyJSON, keyof PropertyDefinitions>,
      RequiredProperties extends string,
      AdditionalProperties extends JSONObject,
      PatternPropertyValue extends AnyJSON,
      PatternProperties extends {[key: string]: PatternPropertyValue},
      Dependencies extends JSONObject
    >
    extends Schema<
      & AnyRequired<PatternPropertyValue, Diff<RequiredProperties, keyof PropertyDefinitions>> //required properties which don't have a specified type:
      & Partial<Pick<PropertyDefinitions, Diff<keyof PropertyDefinitions, RequiredProperties>>> // properties not specified by requiredProperties
      & Pick<PropertyDefinitions, Diff<keyof PropertyDefinitions, Diff<keyof PropertyDefinitions, RequiredProperties>>> // required properties
      & AdditionalProperties
      & Partial<PatternProperties>
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
    return this.setProps({ properties: props }) as any as ObjectSchema<O, RequiredProperties, AdditionalProperties, PatternPropertyValue, PatternProperties, Dependencies>
  }

  required <K extends string> (...required: K[]) {
    return this.setProps({ required }) as any as ObjectSchema<PropertyDefinitions, K, AdditionalProperties, PatternPropertyValue, PatternProperties, Dependencies>
  }

  additionalProperties (additionalProperties: true): this
  additionalProperties (additionalProperties: false): ObjectSchema<PropertyDefinitions, RequiredProperties, {}, PatternPropertyValue, PatternProperties, Dependencies>
  additionalProperties (additionalProperties: boolean) {
    return this.setProps({ additionalProperties })
  }

  patternProperties <T1 extends AnyJSON, Values extends T1>
    (k1: RegExp, t1: Schema<T1>)
    : ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, Values, {[key: string]: Values}, Dependencies>
  patternProperties <T1 extends AnyJSON, T2 extends AnyJSON, Values extends T1 | T2>
    (k1: RegExp, t1: Schema<T1>, k2: RegExp, t2: Schema<T2>)
    : ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, Values, {[key: string]: Values}, Dependencies>
  patternProperties <T1 extends AnyJSON, T2 extends AnyJSON, T3 extends AnyJSON, Values extends T1 | T2 | T3>
    (k1: RegExp, t1: Schema<T1>, k2: RegExp, t2: Schema<T2>, k3: RegExp, t3: Schema<T3>)
    : ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, Values, {[key: string]: Values}, Dependencies>
  patternProperties <T1 extends AnyJSON, T2 extends AnyJSON, T3 extends AnyJSON, T4 extends AnyJSON, Values extends T1 | T2 | T3 | T4>
    (k1: RegExp, t1: Schema<T1>, k2: RegExp, t2: Schema<T2>, k3: RegExp, t3: Schema<T3>, k4: RegExp, t4: Schema<T4>,)
    : ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, Values, {[key: string]: Values}, Dependencies>
  patternProperties <T1 extends AnyJSON, T2 extends AnyJSON, T3 extends AnyJSON, T4 extends AnyJSON, T5 extends AnyJSON, Values extends T1 | T2 | T3 | T4 | T5>
    (k1: RegExp, t1: Schema<T1>, k2: RegExp, t2: Schema<T2>, k3: RegExp, t3: Schema<T3>, k4: RegExp, t4: Schema<T4>, k5: RegExp, t5: Schema<T5>)
    : ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, Values, {[key: string]: Values}, Dependencies>
  patternProperties <T1 extends AnyJSON, T2 extends AnyJSON, T3 extends AnyJSON, T4 extends AnyJSON, T5 extends AnyJSON, T6 extends AnyJSON, Values extends T1 | T2 | T3 | T4 | T5 | T6>
    (k1: RegExp, t1: Schema<T1>, k2: RegExp, t2: Schema<T2>, k3: RegExp, t3: Schema<T3>, k4: RegExp, t4: Schema<T4>, k5: RegExp, t5: Schema<T5>, k6: RegExp, t6: Schema<T6>)
    : ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, Values, {[key: string]: Values}, Dependencies>
  patternProperties <T1 extends AnyJSON, T2 extends AnyJSON, T3 extends AnyJSON, T4 extends AnyJSON, T5 extends AnyJSON, T6 extends AnyJSON, T7 extends AnyJSON, Values extends T1 | T2 | T3 | T4 | T5 | T6 | T7>
    (k1: RegExp, t1: Schema<T1>, k2: RegExp, t2: Schema<T2>, k3: RegExp, t3: Schema<T3>, k4: RegExp, t4: Schema<T4>, k5: RegExp, t5: Schema<T5>, k6: RegExp, t6: Schema<T6>, k7: RegExp, t7: Schema<T7>)
    : ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, Values, {[key: string]: Values}, Dependencies>
  patternProperties <T1 extends AnyJSON, T2 extends AnyJSON, T3 extends AnyJSON, T4 extends AnyJSON, T5 extends AnyJSON, T6 extends AnyJSON, T7 extends AnyJSON, T8 extends AnyJSON, Values extends T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>
    (k1: RegExp, t1: Schema<T1>, k2: RegExp, t2: Schema<T2>, k3: RegExp, t3: Schema<T3>, k4: RegExp, t4: Schema<T4>, k5: RegExp, t5: Schema<T5>, k6: RegExp, t6: Schema<T6>, k7: RegExp, t7: Schema<T7>, k8: RegExp, t8: Schema<T8>, k9: RegExp)
    : ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, Values, {[key: string]: Values}, Dependencies>
  patternProperties <T1 extends AnyJSON, T2 extends AnyJSON, T3 extends AnyJSON, T4 extends AnyJSON, T5 extends AnyJSON, T6 extends AnyJSON, T7 extends AnyJSON, T8 extends AnyJSON, T9 extends AnyJSON, Values extends T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>
    (k1: RegExp, t1: Schema<T1>, k2: RegExp, t2: Schema<T2>, k3: RegExp, t3: Schema<T3>, k4: RegExp, t4: Schema<T4>, k5: RegExp, t5: Schema<T5>, k6: RegExp, t6: Schema<T6>, k7: RegExp, t7: Schema<T7>, k8: RegExp, t8: Schema<T8>, k9: RegExp, t9: Schema<T9>)
    : ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, Values, {[key: string]: Values}, Dependencies>
  patternProperties <T extends AnyJSON>(...args: (RegExp | Schema<AnyJSON>)[]): ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, AnyJSON, JSONObject, Dependencies>
  patternProperties <T extends AnyJSON>(...args: (RegExp | Schema<AnyJSON>)[]) {
    const props = args.filter(x => x instanceof RegExp).map((x: RegExp) => x.source).reduce<JSONObject>((acc, key, i) => {
      const schema = args[i * 2 + 1]
      if (schema instanceof Schema) {
        acc[key] = schema.props
      }
      return acc
    }, {})
    return this.setProps({ patternProperties: props }) as any
  }

  dependencies (dependencies: {[key: string]: Schema<AnyJSON> | string[]}): ObjectSchema<PropertyDefinitions, RequiredProperties, AdditionalProperties, PatternPropertyValue, PatternProperties, JSONObject> {
    const props = Object.keys(dependencies).reduce<JSONObject>((acc, key) => {
      const value = dependencies[key]
      if (Array.isArray(value)) {
        acc[key] = value
      } else {
        acc[key] = value.props
      }
      return acc
    }, {})
    return this.setProps({ dependencies: props }) as any
  }

}
