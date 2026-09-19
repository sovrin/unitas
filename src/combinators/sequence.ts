import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse a sequence of parsers and return all results as an array.
 *
 * @example
 * sequence(char('a'), char('b'), char('c'))('abc') // { ok: true, value: ['a', 'b', 'c'], index: 3 }
 */
export const sequence = <T extends readonly unknown[]>(
    ...parsers: { [K in keyof T]: Parser<T[K]> }
) => {
    return create<T>((input, index = 0, ctx) => {
        const results: unknown[] = [];
        let at = index;

        for (const parser of parsers) {
            const result: Result<unknown> = parser(input, at, ctx);
            if (!result.ok) {
                return result;
            }

            results.push(result.value);
            at = result.index;
        }

        return success(results as unknown as T, at);
    });
};
