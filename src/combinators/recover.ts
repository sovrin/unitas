import type { Parser } from '../core/parser';

import { forward } from '../core/forward';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Use fallback value when parser fails.
 *
 * @example
 * recover(string('hello'), 'default')('world') // { ok: true, value: 'default', remaining: 'world' }
 */
export const recover = <T>(parser: Parser<T>, fallback: T) => {
    return create<T>((input) => {
        const result = parser(input);

        return result.ok ? forward(result) : success(fallback, input);
    });
};
