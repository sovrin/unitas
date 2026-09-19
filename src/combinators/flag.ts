import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Return true if parser succeeds, false otherwise. Always succeeds without consuming input on failure.
 *
 * @example
 * flag(string('*'))('*abc') // { ok: true, value: true, index: 1 }
 * flag(string('*'))('abc') // { ok: true, value: false, index: 0 }
 */
export const flag = <T>(parser: Parser<T>): Parser<boolean> => {
    return create<boolean>((input, index = 0, ctx) => {
        const result = parser(input, index, ctx);

        return result.ok ? success(true, result.index) : success(false, index);
    });
};
