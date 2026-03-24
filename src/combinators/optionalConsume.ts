import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Optionally consume input (always succeeds, returns void).
 *
 * @example
 * optionalConsume(string('hello'))('hello world') // { ok: true, value: undefined, remaining: ' world' }
 * optionalConsume(string('hello'))('world') // { ok: true, value: undefined, remaining: 'world' }
 */
export const optionalConsume = <T>(parser: Parser<T>) => {
    return create<void>((input) => {
        const result = parser(input);

        return result.ok
            ? success(undefined, result.remaining)
            : success(undefined, input);
    });
};
