Typed-JSON-Schema
</br><a href="https://www.npmjs.com/package/typed-json-schema"><img src="https://img.shields.io/npm/v/typed-json-schema.svg" alt="Version"></a>
------------------

## TypeScript-Friendly JSON-Schema Definitions

This library is able to validate JSON-Schema at runtime, and also emit type definitions for the validated data. This means that if you define your data using our JSON-schema builder, you automatically get TypeScript safety on those types.



## Examples

### Schema generation:

``` typescript
import { string, array, object } from 'typed-json-schema'

string.minLength(3) // type: Schema<string>

//generated JSON Schema: 
{
  "type": "string",
  "minLength": "3"
}

array(string.pattern(/\w+/)) // type: Schema<string[]>

//generated JSON Schema:
{
  "type": "array",
  "items": {
    "type": string
    "pattern": "\\w+"
  }
}

object({ a: string, b: array(number) })
  .required('a', 'b') // type: Schema<{a: string, b: number[] }>

//generated JSON Schema:
{
  "type": "object",
    a: { type: 'string' },
    b: { type: 'array', items: { type: 'number' }}
  },
  required: ['a', 'b']
}
```

### Validation

```typescript
import { schema, string, Validator } from 'typed-json-schema'

const validator = new Validator()

const StringOrNull = schema.anyOf(
  string,
  schema.type('null')
)

const validation = validator.validate(StringOrNull, 'Hello'),

if (validation.valid) {
  validation.result.toFixed(1) // error: Property 'toFixed' does not exist on type 'string'.
  validation.result.toLowerCase() //error: object is possibly null
  validation.result && validation.result.toLowerCase() //success!
}
```


## Usage

### Schema Generation

In general, all [JSON-Schema keywords](https://spacetelescope.github.io/understanding-json-schema/reference/index.html) can be used as builders on the `schema` object.

For example:

```typescript
import { schema } from 'typed-json-schema'

const mySchema = schema
  .type('string')
  .minLength(3)
  .pattern(/regex/)
```

Refer to [JSON-Schema keywords](https://spacetelescope.github.io/understanding-json-schema/reference/index.html) for a list of available keywords.

### Shortcuts:
```typescript
import { string, boolean, number, array, object }

const mySchema = string //same as schema.type('string')
const mySchema = number //same as schema.type('number')
const mySchema = boolean //same as schema.type('boolean')
const mySchema = array(string) //same as schema.type('array').items(string)
const mySchema = object({ a: string, b: array(number) }) //same as schema.type('object').properties({ a: string, b: array(number) })
```

### Validation:

Use a `Validator` to validate a json schema:

```typescript
import { schema, Validator }

const validator =  new Validator({ coerceTypes: true }) //any AJV options can be supplied
const validation = validator.validate(schema.type('number'))

if (validation.valid) {
  console.log(validation.result) //type: number
} else {
  console.log(validation.errors) //contains a list of error messages
}

```

see [AJV](http://epoberezkin.github.io/ajv/) for a list of options that can be passed to the validator.
