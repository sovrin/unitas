import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * @example
 * optionally consume input (always succeeds, returns void)
 * optionalConsume(literal('hello'))('hello world') // { ok: true, value: undefined, remaining: ' world' }
 * optionalConsume(literal('hello'))('world') // { ok: true, value: undefined, remaining: 'world' }
 */
export const optionalConsume = <T>(parser: Parser<T>) => {
    return create<void>((input) => {
        const result = parser(input);

        return result.ok
            ? success(undefined, result.remaining)
            : success(undefined, input);
    });
};
