import { AnyJSON, JSONObject } from '../src/json'

const allow:AnyJSON[] = [3, 'asdf', null, false, null, {a: 42, b: 'asdf', z: ['boink', [1]]}, [1,2,3,'asdf']]

let anyObj: JSONObject<{}> = {}

// $ExpectType AnyJSON
anyObj.asdf

let someObj: JSONObject<{ properties: { a: 24 }}> = { a: 24 }

// $ExpectType 24
someObj.a


// $ExpectType AnyJSON
someObj.b