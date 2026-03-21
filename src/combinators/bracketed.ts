import type { Parser } from '../core/parser';

import { literal } from '../terminals/literal';
import { surrounded } from './surrounded';

/**
 * Parse content surrounded by brackets.
 *
 * @example
 * bracketed(literal('hi'))('[hi]') // { ok: true, value: 'hi', remaining: '' }
 */
export const bracketed = <T>(content: Parser<T>) => {
    return surrounded(literal('['), content, literal(']'));
};
