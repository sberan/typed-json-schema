import { Schema } from '../schema'
import { Diff, JSONObject } from '../util'
import { CustomKeyword } from '../validator'

declare module '../schema' {
  interface Schema<State extends SchemaState = DefaultSchemaState> {
    allowNull (): SchemaUpdate<State, 'type', State['type'] | 'null'>
  }
}

Schema.prototype.allowNull = function () {
  const
    props = this.toJSON(),
    enums = props.enum

  let type = props.type

  if (Array.isArray(enums) && !enums.includes(null)) {
    enums.push(null)
  }
  if (!type || type === 'null') {
    return this
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
