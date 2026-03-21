import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';
import { sequence } from './sequence';

/**
 * Extract outer values from a sequence of 3 parsers (skip middle).
 *
 * @example
 * outer(literal('('), literal('hi'), literal(')'))('(hi)') // { ok: true, value: ['(', ')'], remaining: '' }
 */
export const outer = <A, B, C>(
    parserA: Parser<A>,
    parserB: Parser<B>,
    parserC: Parser<C>,
) => {
    return create<[A, C]>(
        map(sequence(parserA, parserB, parserC), ([a, , c]) => [a, c]),
    );
};
