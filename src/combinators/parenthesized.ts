import type { Parser } from '../core/parser';

import { surrounded } from '../combinators/surrounded';
import { literal } from '../terminals/literal';

/**
 * @example
 * parse content surrounded by parentheses
 * parenthesized(literal('hi'))('(hi)') // { ok: true, value: 'hi', remaining: '' }
 */
export const parenthesized = <T>(content: Parser<T>) => {
    return surrounded(literal('('), content, literal(')'));
};
