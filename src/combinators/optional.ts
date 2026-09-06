import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Make parser optional (return null on failure, without consuming input).
 *
 * @example
 * optional(string('hello'))('hello') // { ok: true, value: 'hello', remaining: '' }
 * optional(string('hello'))('world') // { ok: true, value: null, remaining: 'world' }
 */
export const optional = <T>(parser: Parser<T>) => {
    return create<T | null>((input) => {
        const result = parser(input);

        return result.ok ? result : success(null, input);
    });
};
