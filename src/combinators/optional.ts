import type { Parser } from '../core/parser';

import { forward } from '../core/forward';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * @example
 * make parser optional (return null on failure, without consuming input)
 * optional(literal('hello'))('hello') // { ok: true, value: 'hello', remaining: '' }
 * optional(literal('hello'))('world') // { ok: true, value: null, remaining: 'world' }
 */
export const optional = <T>(parser: Parser<T>) => {
    return create<T | null>((input) => {
        const result = parser(input);

        return result.ok ? forward(result) : success(null, input);
    });
};
