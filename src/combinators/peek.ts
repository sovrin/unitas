import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * @example
 * parse without consuming input
 * peek(literal('hello'))('hello world') // { ok: true, value: 'hello', remaining: 'hello world' }
 */
export const peek = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        return result.ok ? success(result.value, input) : failure();
    });
};
