import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Make parser optional (return null on failure, without consuming input).
 *
 * @example
 * optional(string('hello'))('hello') // { ok: true, value: 'hello', index: 5 }
 * optional(string('hello'))('world') // { ok: true, value: null, index: 0 }
 */
export const optional = <T>(parser: Parser<T>) => {
    return create<T | null>((input, index = 0, ctx) => {
        const result = parser(input, index, ctx);

        return result.ok ? result : success(null, index);
    });
};
