
import { Schema, JSONObject } from "./schema";

export class NumberSchema extends Schema<number> {
  constructor (props: JSONObject = { type: 'number' }) {
    super(props)
  }

  maximum(maximum: number) {
    return this.setProps({ maximum })
  }

  minimum(minimum: number) {
    return this.setProps({ minimum })
  }

  exclusiveMaximum(exclusiveMaximum: number | boolean) {
    return this.setProps({ exclusiveMaximum })
  }

  exclusiveMinimum(exclusiveMinimum: number | boolean) {
    return this.setProps({ exclusiveMinimum })
  }

  multipleOf(multipleOf: number) {
    return this.setProps({ multipleOf })
  }
}
