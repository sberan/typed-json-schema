
import { Schema, JSONObject, AnyJSON } from "./schema"

export class ArraySchema<T extends AnyJSON> extends Schema<T>  {
  constructor (props: JSONObject = { type: 'array' }) {
    super(props)
  }

  maxItems (maxItems: number) {
    return this.setProps({ maxItems })
  }

  minItems (minItems: number) {
    return this.setProps({ minItems })
  }

  uniqueItems (uniqueItems: boolean) {
    return this.setProps({ uniqueItems })
  }

  items <I extends AnyJSON> (items: Schema<I>): ArraySchema<I[]> 
  items <A0 extends AnyJSON> (items: [Schema<A0>]): TupleSchema<[A0], A0> 
  items <A0 extends AnyJSON, A1 extends AnyJSON> (items: [Schema<A0>, Schema<A1>]): TupleSchema<[A0, A1], (A0 | A1)> 
  items <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON> (items: [Schema<A0>, Schema<A1>, Schema<A2>]): TupleSchema<[A0, A1, A2], (A0 | A1 | A2)>
  items <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON> (items: [Schema<A0>, Schema<A1>, Schema<A2>, Schema<A3>]): TupleSchema<[A0, A1, A2, A3], (A0 | A1 | A2 | A3)>
  items <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON> (items: [Schema<A0>, Schema<A1>, Schema<A2>, Schema<A3>, Schema<A4>]): TupleSchema<[A0, A1, A2, A3, A4], (A0 | A1 | A2 | A3 | A4)>
  items <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON> (items: [Schema<A0>, Schema<A1>, Schema<A2>, Schema<A3>, Schema<A4>, Schema<A5>]): TupleSchema<[A0, A1, A2, A3, A4, A5], (A0 | A1 | A2 | A3 | A4 | A5)>
  items <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON> (items: [Schema<A0>, Schema<A1>, Schema<A2>, Schema<A3>, Schema<A4>, Schema<A5>, Schema<A6>]): TupleSchema<[A0, A1, A2, A3, A4, A5, A6], (A0 | A1 | A2 | A3 | A4 | A5 | A6)>
  items <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON> (items: [Schema<A0>, Schema<A1>, Schema<A2>, Schema<A3>, Schema<A4>, Schema<A5>, Schema<A6>, Schema<A7>]): TupleSchema<[A0, A1, A2, A3, A4, A5, A6, A7], (A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7)>
  items <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON, A8 extends AnyJSON> (items: [Schema<A0>, Schema<A1>, Schema<A2>, Schema<A3>, Schema<A4>, Schema<A5>, Schema<A6>, Schema<A7>, Schema<A8>]): TupleSchema<[A0, A1, A2, A3, A4, A5, A6, A7, A8], (A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8)>
  items <A0 extends AnyJSON, A1 extends AnyJSON, A2 extends AnyJSON, A3 extends AnyJSON, A4 extends AnyJSON, A5 extends AnyJSON, A6 extends AnyJSON, A7 extends AnyJSON, A8 extends AnyJSON, A9 extends AnyJSON> (items: [Schema<A0>, Schema<A1>, Schema<A2>, Schema<A3>, Schema<A4>, Schema<A5>, Schema<A6>, Schema<A7>, Schema<A8>, Schema<A9>]): TupleSchema<[A0, A1, A2, A3, A4, A5, A6, A7, A8, A9], (A0 | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9)>
  items <I extends AnyJSON> (items: Schema<I> | Schema<AnyJSON>[]) {
    if (Array.isArray(items)) {
      const tupleProps = this.setProps({ items: items.map(i => i.props)}).props
      return new TupleSchema(tupleProps) as any
    } else {
      return this.setProps({ items: items.props })
    }
  }

  contains (contains: Schema<any>) {
    return this.setProps({ contains: contains.props })
  }
}

export class TupleSchema<T extends AnyJSON[], A extends AnyJSON> extends ArraySchema<T> {
  constructor (props: JSONObject) {
    super(props)
  }

  additionalItems (additionalItems: true) : ArraySchema<AnyJSON[]>
  additionalItems (additionalItems: false) : this
  additionalItems <N extends AnyJSON> (additionalItems: Schema<N>) : ArraySchema<(A| N)[]>
  additionalItems <N extends AnyJSON> (additionalItems: boolean | Schema<N> ) : ArraySchema<A[]> | TupleSchema<T, A> | ArraySchema<(A| N)[]> {
    if (additionalItems === true) {
      return this.setProps({ additionalItems: true }) as any as ArraySchema<any[]>
    } else if (additionalItems === false) {
      return this
    } else {
      return this.setProps({ additionalItems: additionalItems.props }) as any as ArraySchema<(A | N)[]>
    }
  }
}
