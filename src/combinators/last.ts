import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';

export type Last<T extends readonly unknown[]> = T extends readonly [
    ...unknown[],
    infer L,
]
    ? L
    : T extends readonly (infer L)[]
      ? L
      : never;

/**
 * Extract the last element from a parser result array.
 *
 * @example
 * last(sequence(char('a'), char('b')))('ab') // { ok: true, value: 'b', remaining: '' }
 */
export const last = <T extends readonly unknown[]>(parser: Parser<T>) => {
    return create<Last<T>>(
        map(parser, (arr) => arr[arr.length - 1] as Last<T>),
    );
};
