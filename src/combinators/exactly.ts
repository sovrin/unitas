import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse exactly n occurrences.
 *
 * @example
 * exactly(char('a'), 3)('aaa') // { ok: true, value: ['a', 'a', 'a'], index: 3, furthest: -1, expected: [] }
 */
export const exactly = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input, index = 0) => {
        const results: T[] = [];
        let at = index;
        let trace: Result<unknown> = success(null, index);

        for (let i = 0; i < n; i++) {
            const result: Result<T> = merge(trace, parser(input, at));
            trace = result;

            if (!result.ok) {
                return result;
            }

            results.push(result.value);
            at = result.index;
        }

        return merge(trace, success(results, at));
    });
};
