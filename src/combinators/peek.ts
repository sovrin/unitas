import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Look ahead without consuming input.
 *
 * @example
 * peek(string('hello'))('hello world') // { ok: true, value: 'hello', index: 0 }
 */
export const peek = <T>(parser: Parser<T>) => {
    return create<T>((input, index = 0, ctx) => {
        const result = parser(input, index, ctx);

        return result.ok ? success(result.value, index) : result;
    });
};
