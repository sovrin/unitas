import type { Parser } from '../core/parser';

import { map } from './map';

/**
 * Join string array parser result into a single string.
 *
 * @example
 * concat(many(letter))('abc123') // { ok: true, value: 'abc', index: 3 }
 * concat(many(letter), '-')('abc123') // { ok: true, value: 'a-b-c', index: 3 }
 */
export const concat = (
    parser: Parser<string[]>,
    separator = '',
): Parser<string> => {
    return map(parser, (parts) => parts.join(separator));
};
