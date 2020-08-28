import { AnyJson, JsonObject } from '../src/schema'

const allow:AnyJson[] = [3, 'asdf', null, false, null, {a: 42, b: 'asdf', z: ['boink', [1]]}, [1,2,3,'asdf']]

let anyObj: JsonObject<{}> = {}
anyObj.asdf // $ExpectType AnyJsonValue

let someObj: JsonObject<{ properties: { a: 24 }}> = { a: 24 }
someObj.a // $ExpectType 24 | undefined
someObj.b // $ExpectType AnyJsonValue

