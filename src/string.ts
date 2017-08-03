import { Schema } from "./schema"

export class StringSchema extends Schema<string> {
  constructor () {
    super({ type: 'string' })
  }

  maxLength (maxLength: number) {
    return this.setProps({ maxLength })
  }

  minLength (minLength: number) {
    return this.setProps({ minLength })
  }

  pattern (pattern: RegExp) {
    return this.setProps({ pattern: pattern.source })
  }
}