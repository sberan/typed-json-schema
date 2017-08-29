import { schema, array, string, number, boolean, object } from '../src'

// $ExpectType number
schema.type('number').TypeOf

// $ExpectType string | number
schema.type(['string', 'number']).TypeOf

// $ExpectType any[]
array.TypeOf

// $ExpectType string[]
array.items(string).TypeOf

// $ExpectType number | string[]
schema.type(['number', 'array']).items(string).TypeOf

// $ExpectType (string | number)[]
array.items(string).additionalItems(number).TypeOf

// $ExpectType (string | number)[]
array.items([string, number]).TypeOf

// $ExpectType (string | number | boolean)[]
array.items([string, number]).additionalItems(boolean).TypeOf

// $ExpectType any
object.TypeOf.someRandomProperty

// $ExpectType string | undefined
object.properties({ a: string }).TypeOf.a

// $ExpectType any
object.TypeOf.b

// $ExpectType string
object.properties({ a: string }).required('a').TypeOf.a

// $ExpectType any
object.properties({ a: string }).required('b').TypeOf.b

// $ExpectType string | undefined
object.properties({ a: string }).additionalProperties(false).TypeOf.a

// $ExpectError Property 'b' does not exist
object.properties({ a: string }).additionalProperties(false).TypeOf.b

// $ExpectType string | boolean | undefined
object.properties({ a: string }).additionalProperties(schema.type(['string', 'boolean'])).TypeOf.b

// $ExpectType string | boolean | undefined
object.properties({ a: string }).additionalProperties(false).patternProperties({ '\\w+': string, 'a': boolean }).TypeOf.c

// $ExpectType string | undefined
object.properties({ a: string }).additionalProperties(false).patternProperties({ '\\w+': object.properties({a: string}) }).TypeOf.c!.a

// $ExpectType true | "a" | 42
schema.enum([true, 'a', 42]).TypeOf

const b = object.properties({ brand: object.enum(['b']), b: string }).required('brand', 'b').additionalProperties(false)
const c = object.properties({ brand: object.enum(['c']), c: string }).required('brand', 'c').additionalProperties(false)
const x = object.properties({ a: number }).additionalProperties(false).anyOf([b, c]).TypeOf

// $ExpectType number | undefined
x.a

if (x.brand === 'b') {
  // $ExpectType string
  x.b
  // $ExpectError Property 'c' does not exist
  x.c
} else {
  // $ExpectType string
  x.c
  // $ExpectError Property 'b' does not exist
  x.b
}

const oneOf = object.properties({ a: number }).additionalProperties(false).oneOf([b]).TypeOf

// $ExpectType number | undefined
oneOf.a

// $ExpectType string
oneOf.b

const ASchema = schema.type(['string', 'null'])
type ASchema = schema<typeof ASchema>

function foo (value: ASchema) {
  // $ExpectType string | null
  value
}