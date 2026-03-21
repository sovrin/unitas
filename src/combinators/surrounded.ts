import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { inner } from './inner';

/**
 * Parse content surrounded by delimiters.
 *
 * @example
 * surrounded(literal('['), literal('hi'), literal(']'))('[hi]') // { ok: true, value: 'hi', remaining: '' }
 * surrounded(literal('a'), literal('b'), literal('c'))('abc') // { ok: true, value: 'b', remaining: '' }
 */
export const surrounded = <T>(
    first: Parser,
    content: Parser<T>,
    second?: Parser,
) => {
    return create<T>(inner(first, content, second || first));
};
