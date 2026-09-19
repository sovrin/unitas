import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { inner } from './inner';

/**
 * Parse content surrounded by delimiters.
 *
 * @example
 * surrounded(char('['), string('hi'), char(']'))('[hi]') // { ok: true, value: 'hi', index: 4 }
 * surrounded(char('a'), char('b'), char('c'))('abc') // { ok: true, value: 'b', index: 3 }
 */
export const surrounded = <T>(
    first: Parser,
    content: Parser<T>,
    second?: Parser,
) => {
    return create<T>(inner(first, content, second || first));
};
