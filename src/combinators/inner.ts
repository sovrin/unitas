import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';
import { sequence } from './sequence';

/**
 * Extract inner value from surrounded content (like inner of braced).
 *
 * @example
 * inner(literal('('), literal('hi'), literal(')'))('(hi)') // { ok: true, value: 'hi', remaining: '' }
 */
export const inner = <A, B, C>(
    parserA: Parser<A>,
    parserB: Parser<B>,
    parserC: Parser<C>,
) => {
    return create<B>(map(sequence(parserA, parserB, parserC), ([, b]) => b));
};
