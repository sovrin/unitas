import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse a sequence of parsers and return all results as an array.
 *
 * @example
 * sequence(char('a'), char('b'), char('c'))('abc') // { ok: true, value: ['a', 'b', 'c'], index: 3, furthest: -1, expected: [] }
 */
export const sequence = <T extends readonly unknown[]>(
    ...parsers: { [K in keyof T]: Parser<T[K]> }
) => {
    return create<T>((input, index = 0) => {
        const results: unknown[] = [];
        let at = index;
        let trace: Result<unknown> = success(null, index);

        for (const parser of parsers) {
            const result: Result<unknown> = merge(trace, parser(input, at));
            trace = result;

            if (!result.ok) {
                return result;
            }

            results.push(result.value);
            at = result.index;
        }

        return merge(trace, success(results as unknown as T, at));
    });
};
