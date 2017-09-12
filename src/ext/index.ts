import { CustomKeywords } from '../validator'
import { allowNull } from './allow-null'
import { strictProperties } from './strict-properties'
import { trim } from './trim'

export { CustomKeyword } from '../validator'

export const ext: CustomKeywords = [
  allowNull,
  strictProperties,
  trim
]
