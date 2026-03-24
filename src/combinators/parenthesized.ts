import type { Parser } from '../core/parser';

import { surrounded } from '../combinators/surrounded';
import { string } from '../terminals/string';

/**
 * Parse content surrounded by parentheses.
 *
 * @example
 * parenthesized(string('hi'))('(hi)') // { ok: true, value: 'hi', remaining: '' }
 */
export const parenthesized = <T>(content: Parser<T>) => {
    return surrounded(string('('), content, string(')'));
};
