
import { Schema } from "./schema";

export class BooleanSchema extends Schema<boolean> {
  constructor () {
    super({ type: 'boolean' })
  }
}
