import type { Parser } from '../core/parser';

import { string } from '../terminals/string';
import { surrounded } from './surrounded';

/**
 * Parse content surrounded by brackets.
 *
 * @example
 * bracketed(string('hi'))('[hi]') // { ok: true, value: 'hi', remaining: '' }
 */
export const bracketed = <T>(content: Parser<T>) => {
    return surrounded(string('['), content, string(']'));
};
