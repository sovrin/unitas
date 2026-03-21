import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';

/**
 * @example
 * extract the last element from a parser result array
 * last(sequence(literal('a'), literal('b')))('ab') // { ok: true, value: 'b', remaining: '' }
 */
export type Last<T extends readonly unknown[]> = T extends readonly [
    ...unknown[],
    infer L,
]
    ? L
    : never;

export const last = <T extends readonly [unknown, ...unknown[]]>(
    parser: Parser<T>,
) => {
    return create<Last<T>>(
        map(parser, (arr) => arr[arr.length - 1] as Last<T>),
    );
};
