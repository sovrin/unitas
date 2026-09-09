import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Consume input if the parser matches, discarding the result.
 *
 * @example
 * optionalConsume(string('hi'))('hi there') // { ok: true, index: 2 }
 */
export const optionalConsume = <T>(parser: Parser<T>) => {
    return create<void>((input, index = 0, ctx) => {
        const result = parser(input, index, ctx);

        return result.ok
            ? success(undefined, result.index)
            : success(undefined, index);
    });
};
