
import { Schema, Props } from "./schema"

export class ArraySchema<T> extends Schema<T[]>  {
  constructor (props: Props = { type: 'array' }) {
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

  items <A> (items: [Schema<A>]): TupleSchema<[A], A> 
  items <A, B> (items: [Schema<A>, Schema<B>]): TupleSchema<[A, B], (A | B)> 
  items <A, B, C> (items: [Schema<A>, Schema<B>, Schema<C>]): TupleSchema<[A, B, C], (A | B | C)>
  items <A, B, C, D> (items: [Schema<A>, Schema<B>, Schema<C>, Schema<D>]): TupleSchema<[A, B, C, D], (A | B | C | D)>
  items <A, B, C, D, E> (items: [Schema<A>, Schema<B>, Schema<C>, Schema<D>, Schema<E>]): TupleSchema<[A, B, C, D, E], (A | B | C | D | E)>
  items <A, B, C, D, E, F> (items: [Schema<A>, Schema<B>, Schema<C>, Schema<D>, Schema<E>, Schema<F>]): TupleSchema<[A, B, C, D, E, F], (A | B | C | D | E | F)>
  items <A, B, C, D, E, F, G> (items: [Schema<A>, Schema<B>, Schema<C>, Schema<D>, Schema<E>, Schema<F>, Schema<G>]): TupleSchema<[A, B, C, D, E, F, G], (A | B | C | D | E | F | G)>
  items <A, B, C, D, E, F, G, H> (items: [Schema<A>, Schema<B>, Schema<C>, Schema<D>, Schema<E>, Schema<F>, Schema<G>, Schema<H>]): TupleSchema<[A, B, C, D, E, F, G, H], (A | B | C | D | E | F | G | H)>
  items <A, B, C, D, E, F, G, H, I> (items: [Schema<A>, Schema<B>, Schema<C>, Schema<D>, Schema<E>, Schema<F>, Schema<G>, Schema<H>, Schema<I>]): TupleSchema<[A, B, C, D, E, F, G, H, I], (A | B | C | D | E | F | G | H | I)>
  items <A, B, C, D, E, F, G, H, I, J> (items: [Schema<A>, Schema<B>, Schema<C>, Schema<D>, Schema<E>, Schema<F>, Schema<G>, Schema<H>, Schema<I>, Schema<J>]): TupleSchema<[A, B, C, D, E, F, G, H, I, J], (A | B | C | D | E | F | G | H | I | J)>
  items <A, B, C, D, E, F, G, H, I, J, K> (items: [Schema<A>, Schema<B>, Schema<C>, Schema<D>, Schema<E>, Schema<F>, Schema<G>, Schema<H>, Schema<I>, Schema<J>, Schema<K>]): TupleSchema<[A, B, C, D, E, F, G, H, I, J, K], (A | B | C | D | E | F | G | H | I | J | K )>
  items <A, B, C, D, E, F, G, H, I, J, K, L> (items: [Schema<A>, Schema<B>, Schema<C>, Schema<D>, Schema<E>, Schema<F>, Schema<G>, Schema<H>, Schema<I>, Schema<J>, Schema<K>, Schema<L>]): TupleSchema<[A, B, C, D, E, F, G, H, I, J, K, L], (A | B | C | D | E | F | G | H | I | J | K | L)>
  items <I> (items: Schema<I>): ArraySchema<I[]> 
  items <I> (items: Schema<I> | Schema<any>[]) {
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

export class TupleSchema<T, A> extends ArraySchema<T> {
  constructor (props: Props) {
    super(props)
  }

  additionalItems (additionalItems: true) : ArraySchema<any[]>
  additionalItems (additionalItems: false) : TupleSchema<T, A>
  additionalItems <N> (additionalItems: Schema<N>) : ArraySchema<(A| N)[]>
  additionalItems <N> (additionalItems: boolean | Schema<N> ) : ArraySchema<A[]> | TupleSchema<T, A> | ArraySchema<(A| N)[]> {
    if (additionalItems === true) {
      return this.setProps({ additionalItems: true }) as any as ArraySchema<any[]>
    } else if (additionalItems === false) {
      return this
    } else {
      return this.setProps({ additionalItems: additionalItems.props }) as any as ArraySchema<(A | N)[]>
    }
  }
}
