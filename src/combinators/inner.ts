import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';
import { sequence } from './sequence';

/**
 * Parse three parsers in sequence and keep only the middle result.
 *
 * @example
 * inner(char('('), string('hi'), char(')'))('(hi)') // { ok: true, value: 'hi', index: 4 }
 */
export const inner = <A, B, C>(
    parserA: Parser<A>,
    parserB: Parser<B>,
    parserC: Parser<C>,
) => {
    return create<B>(map(sequence(parserA, parserB, parserC), ([, b]) => b));
};
