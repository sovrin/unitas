import type { Parser } from '../core/parser';

import { literal } from '../terminals/literal';
import { surrounded } from './surrounded';

/**
 * @example
 * parse content surrounded by brackets
 * bracketed(literal('hi'))('[hi]') // { ok: true, value: 'hi', remaining: '' }
 */
export const bracketed = <T>(content: Parser<T>) => {
    return surrounded(literal('['), content, literal(']'));
};
