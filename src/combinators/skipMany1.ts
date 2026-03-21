import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { many1 } from './many1';
import { map } from './map';

/**
 * Skip one or more occurrences (fails if no matches).
 *
 * @example
 * skipMany1(literal('a'))('aaabc') // { ok: true, value: null, remaining: 'bc' }
 */
export const skipMany1 = <T>(parser: Parser<T>) => {
    return create<null>(map(many1(parser), () => null));
};
