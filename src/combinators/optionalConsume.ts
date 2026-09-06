import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Consume input if the parser matches, discarding the result.
 *
 * @example
 * optionalConsume(string('hi'))('hi there') // { ok: true, index: 2, furthest: -1, expected: [] }
 */
export const optionalConsume = <T>(parser: Parser<T>) => {
    return create<void>((input, index = 0) => {
        const result = parser(input, index);

        return result.ok
            ? merge(result, success(undefined, result.index))
            : merge(result, success(undefined, index));
    });
};
