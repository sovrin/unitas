import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse a sequence of parsers and return all results as an array.
 *
 * @example
 * sequence(literal('a'), literal('b'), literal('c'))('abc') // { ok: true, value: ['a', 'b', 'c'], remaining: '' }
 */
export const sequence = <T extends readonly unknown[]>(
    ...parsers: { [K in keyof T]: Parser<T[K]> }
) => {
    return create<T>((input) => {
        const results: unknown[] = [];
        let remaining = input;

        for (const parser of parsers) {
            const result = parser(remaining);
            if (!result.ok) {
                return failure();
            }

            results.push(result.value);
            remaining = result.remaining;
        }

        return success(results as unknown as T, remaining);
    });
};
