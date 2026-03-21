import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';

/**
 * @example
 * extract the nth element from a parser result array
 * nth(sequence(literal('a'), literal('b'), literal('c')), 1)('abc') // { ok: true, value: 'b', remaining: '' }
 */
type IsWidenedNumber<N extends number> = number extends N ? true : false;

type IsInvalidIndex<N extends number> = `${N}` extends
    | `-${string}`
    | `${string}.${string}`
    ? true
    : false;

type TupleIndex<
    U extends readonly unknown[],
    N extends number,
> = N extends keyof U ? U[N] : undefined;

export type Nth<T extends readonly unknown[], N extends number> =
    IsWidenedNumber<N> extends true
        ? T[number] | undefined
        : IsInvalidIndex<N> extends true
          ? undefined
          : T extends readonly [...infer U]
            ? TupleIndex<U, N>
            : T[N];

export const nth = <T extends readonly unknown[], N extends number>(
    parser: Parser<T>,
    index: N,
): Parser<Nth<T, N>> => {
    return create<Nth<T, N>>(map(parser, (arr) => arr[index] as Nth<T, N>));
};
