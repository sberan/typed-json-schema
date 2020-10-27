#!/usr/bin/env node
import fs = require('fs')
import { AnyJson, AnyJsonValue } from './json'
import { JsonTypeName } from './keywords'
import { is } from './schema'

const spreadArrayKeys = ['type', 'enum', 'required', 'items', 'oneOf', 'anyOf', 'allOf']
const subSchemaKeys = ['items', 'contains', 'additionalItems', 'additionalProperties', 'not', 'oneOf', 'anyOf', 'allOf']
const schemaMapKeys = ['properties', 'patternProperties', 'dependencies']

const isSubSchema = is().oneOf(is('object'), is().enum(...JsonTypeName))
const isStrictObject = is('object', {
  type: is().const('object'),
  properties: 'object',
  required: is('array').items('string'),
  additionalProperties: is().const(false)
})

function formatJson (key: string, input: AnyJsonValue, isDeepValue = false): string {
  if (is('array').check(input)) {
    const values = input.map(x => formatJson(key, x, true)).join(', ')
    const spreadArray = key && spreadArrayKeys.includes(key) && !isDeepValue
    if (spreadArray) {
      return values
    }
    return `[${values}]`
  }

  if(is('string').check(input)) {
    if (key === 'pattern') {
      return new RegExp(input).toString()
    }
    return `'${input.replace(/'/g, '\\\'')}'`
  }

  if(((schemaMapKeys.includes(key) && isDeepValue) || subSchemaKeys.includes(key)) && isSubSchema.check(input)) {
    return formatSchema(input)
  }

  if (schemaMapKeys.includes(key) && is('object').check(input)) {
    return '{ ' + Object.keys(input).map(innerKey => `${innerKey.match(/^[A-Za-z0-9_]+$/)
      ? innerKey : formatJson(key, innerKey)}: ${formatJson(key, input[innerKey], true)}`).join(', ') + ' }'
  }

  return JSON.stringify(input)
}

function formatSchema(input: AnyJson, root = false) {
  const type = is('string').check(input) ? [input] 
    : is('object').properties({ type: 'string' }).required('type').check(input) ? [input.type]
    : is('object').properties({ type: is('array').items('string') }).required('type').check(input) ? input.type
    : []

  if (type.length === 1 && !root && is('object').check(input) && Object.keys(input).length <= 1) {
    return formatJson('type', type)
  }

  if (isStrictObject.check(input) && Object.keys(input.properties).every(key => input.required.includes(key))) {
    return `is('object', ${formatJson('properties', input.properties)})`
  }

  let result = `is(${formatJson('type', type)})`

  
  is('object').check(input) && Object.keys(input).forEach(key => {
    if (key === 'type')
      return
    let value = input[key]

    result = result + '.' + key + `(${formatJson(key, value)})`
  })
  return result
}

export default function generate(input: string) {
  const schema = is('object').parse(input)
  return formatSchema(schema, true)
}
if (require.main === module) {
  try {
    const input = fs.readFileSync(0).toString() 
    console.log(generate(input))
  } catch (err) {
    console.error(err)
  }
}