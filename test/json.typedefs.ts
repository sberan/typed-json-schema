import { AnyJson, JsonObject } from '../src/json'

const allow:AnyJson[] = [3, 'asdf', null, false, null, {a: 42, b: 'asdf', z: ['boink', [1]]}, [1,2,3,'asdf']]

let anyObj: JsonObject<{}> = {}
anyObj.asdf // $ExpectType AnyJsonValue

let someObj: JsonObject<{ properties: { a: 24 }}> = { a: 24 }
someObj.a // $ExpectType 24 | undefined
someObj.b // $ExpectType AnyJsonValue


let someObjRequired: JsonObject<{properties: {a: 24, b:32, c: 'asdf'}, required: 'a' | 'b' | 'd'}> = {a: 24, b: 32, d: ['a']}
someObjRequired.a // $ExpectType 24
someObjRequired.b // $ExpectType 32
someObjRequired.c // $ExpectType "asdf" | undefined
someObjRequired.d // $ExpectType AnyJson
someObjRequired.e // $ExpectType AnyJsonValue

let someStrictObject: JsonObject<{properties: {a: 24, b: 'asdf' }, required: 'a', additionalProperties: false}> = {a: 24, b: 'asdf'}
someStrictObject.a // $ExpectType 24
someStrictObject.b // $ExpectType "asdf" | undefined
someStrictObject.c // $ExpectError Property 'c' does not exist on type 'JsonObject<{ properties: { a: 24; b: "asdf"; }; required: "a"; additionalProperties: false; }>'.
