
import { Schema } from "./schema";

export class NullSchema extends Schema<null> {
  constructor () {
    super({ type: 'null' })
  }
}
