import { Schema } from '../schema'
import { CustomKeyword } from '../validator'

declare module '../schema' {
  interface Schema {
    trim (trim?: boolean): Schema
  }
}

Schema.prototype.trim = function (trim = true) {
  return this.setProps({ trim })
}

export const trim: CustomKeyword = {
  name: 'trim',
  modifying: true,
  validate: (
    schema: any,
    data: any,
    parentSchema?: object,
    dataPath?: string,
    parentData?: object | any[],
    parentDataProperty?: string | number,
    rootData?: object | any[]
  ) => {
    if (typeof data === 'string' && parentData !== undefined && parentDataProperty !== undefined) {
      const trimmedString = data.trim();
      (parentData as any)[parentDataProperty] = trimmedString
    }
    return true
  }
}
