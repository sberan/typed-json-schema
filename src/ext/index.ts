import { CustomKeywords } from '../validator'
import './allow-null'
import { allowNull } from './allow-null'
import './strict-properties'
import { strictProperties } from './strict-properties'
import './trim'
import { trim } from './trim'

export { CustomKeyword } from '../validator'

export const ext: CustomKeywords = [
  allowNull,
  strictProperties,
  trim
]

export * from '../index'
