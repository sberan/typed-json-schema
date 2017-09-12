import { Schema } from '../schema'
import { Diff, JSONObject } from '../util'
import { CustomKeyword } from '../validator'

declare module '../schema' {
  interface Schema<State extends SchemaState = DefaultSchemaState> {
    allowNull (): SchemaUpdate<State, 'type', State['type'] | 'null'>
  }
}

Schema.prototype.allowNull = function () {
  let type = this.toJSON().type
  if (type === 'null') {
    return this
  }
  if (!type) {
    return this.setProps({ type: 'null' })
  }
  if (!Array.isArray(type)) {
    type = [type]
  }
  if (!type.includes('null')) {
    type.push('null')
  }
  return this.setProps({ type })
}

export const allowNull = []
