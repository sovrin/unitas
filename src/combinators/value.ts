import type { Parser } from '../core/parser';

import { map } from './map';

/**
 * Replace parsed value with a constant.
 *
 * @example
 * value(string('true'), true)('true') // { ok: true, value: true, index: 4, furthest: -1, expected: [] }
 * value(string('null'), null)('null') // { ok: true, value: null, index: 4, furthest: -1, expected: [] }
 */
export const value = <T, U>(parser: Parser<T>, constant: U): Parser<U> => {
    return map(parser, () => constant);
};
