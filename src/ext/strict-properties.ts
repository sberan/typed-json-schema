import { Schema } from '../schema'
import { Diff, JSONObject } from '../util'
import { CustomKeyword } from '../validator'

declare module '../schema' {
  interface TypeDefs<State extends SchemaState> {
    strictObject: {[P in Diff<keyof State['strictProperties'], State['optional']>]: State['strictProperties'][P] }
                  & {[P in State['optional']]?: State['strictProperties'][P] }
  }

  interface SchemaState {
    strictProperties: any
    optional: string
  }

  interface DefaultSchemaState {
    strictProperties: {}
    optional: never
  }

  interface Schema<State extends SchemaState = DefaultSchemaState> {
    strictProperties<Properties extends {[P: string]: Schema<any>}> (properties: Properties)
      : SchemaMultiUpdate<State, 'strictProperties' | 'type', {
        type: 'strictObject',
        strictProperties: {[K in keyof Properties]: Properties[K]['TypeOf']}
    }>

    optional<Properties extends string> (...properties: Properties[])
     : SchemaUpdate<State, 'optional', Properties>
  }
}

Schema.prototype.strictProperties = function (strictProperties): any {
  const
    optional = this.getState('optional') as string[] | undefined,
    strictKeys = Object.keys(strictProperties).filter(p => {
      return !optional || optional.indexOf(p) < 0
    })
  return this
    .properties(strictProperties)
    .additionalProperties(false)
    .required(...strictKeys)
}

Schema.prototype.optional = function (...properties): any {
  this.setState('optional', properties)
  const props = this.toJSON(),
    existingRequireds = props && props.required
  if (Array.isArray(existingRequireds)) {
    properties.forEach(property => {
      const existingIndex = existingRequireds.indexOf(property)
      if (existingIndex !== -1) {
        existingRequireds.splice(existingIndex, 1)
      }
    })
  }
  return this
}

export const strictProperties = []
