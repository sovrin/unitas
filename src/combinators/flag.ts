import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Return true if parser succeeds, false otherwise. Always succeeds without consuming input on failure.
 *
 * @example
 * flag(string('*'))('*abc') // { ok: true, value: true, remaining: 'abc' }
 * flag(string('*'))('abc') // { ok: true, value: false, remaining: 'abc' }
 */
export const flag = <T>(parser: Parser<T>): Parser<boolean> => {
    return create<boolean>((input) => {
        const result = parser(input);

        return result.ok
            ? success(true, result.remaining)
            : success(false, input);
    });
};
