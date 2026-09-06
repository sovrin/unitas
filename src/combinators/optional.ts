import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Make parser optional (return null on failure, without consuming input).
 *
 * @example
 * optional(string('hello'))('hello') // { ok: true, value: 'hello', index: 5, furthest: -1, expected: [] }
 * optional(string('hello'))('world') // { ok: true, value: null, index: 0, furthest: 0, expected: ["'hello'"] }
 */
export const optional = <T>(parser: Parser<T>) => {
    return create<T | null>((input, index = 0) => {
        const result = parser(input, index);

        return result.ok ? result : merge(result, success(null, index));
    });
};
