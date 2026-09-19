import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Use fallback value when parser fails.
 *
 * @example
 * recover(string('hello'), 'default')('world') // { ok: true, value: 'default', index: 0 }
 */
export const recover = <T>(parser: Parser<T>, fallback: T) => {
    return create<T>((input, index = 0, ctx) => {
        const result = parser(input, index, ctx);

        return result.ok ? result : success(fallback, index);
    });
};
