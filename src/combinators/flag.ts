import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Return true if parser succeeds, false otherwise. Always succeeds without consuming input on failure.
 *
 * @example
 * flag(string('*'))('*abc') // { ok: true, value: true, index: 1, furthest: -1, expected: [] }
 * flag(string('*'))('abc') // { ok: true, value: false, index: 0, furthest: 0, expected: ["'*'"] }
 */
export const flag = <T>(parser: Parser<T>): Parser<boolean> => {
    return create<boolean>((input, index = 0) => {
        const result = parser(input, index);

        return result.ok
            ? merge(result, success(true, result.index))
            : merge(result, success(false, index));
    });
};
