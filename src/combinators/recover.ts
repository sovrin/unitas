import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Use fallback value when parser fails.
 *
 * @example
 * recover(string('hello'), 'default')('world') // { ok: true, value: 'default', index: 0, furthest: 0, expected: ["'hello'"] }
 */
export const recover = <T>(parser: Parser<T>, fallback: T) => {
    return create<T>((input, index = 0) => {
        const result = parser(input, index);

        return result.ok ? result : merge(result, success(fallback, index));
    });
};
