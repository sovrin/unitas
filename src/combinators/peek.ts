import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Look ahead without consuming input.
 *
 * @example
 * peek(string('hello'))('hello world') // { ok: true, value: 'hello', index: 0, furthest: -1, expected: [] }
 */
export const peek = <T>(parser: Parser<T>) => {
    return create<T>((input, index = 0) => {
        const result = parser(input, index);

        return result.ok ? merge(result, success(result.value, index)) : result;
    });
};
