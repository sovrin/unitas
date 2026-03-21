import type { Parser } from '../core/parser';

import { surrounded } from '../combinators/surrounded';
import { literal } from '../terminals/literal';

/**
 * Parse content surrounded by parentheses.
 *
 * @example
 * parenthesized(literal('hi'))('(hi)') // { ok: true, value: 'hi', remaining: '' }
 */
export const parenthesized = <T>(content: Parser<T>) => {
    return surrounded(literal('('), content, literal(')'));
};
