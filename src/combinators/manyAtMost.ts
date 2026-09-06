import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse at most n occurrences (never fails).
 *
 * @example
 * manyAtMost(char('a'), 2)('aaa') // { ok: true, value: ['a', 'a'], index: 2, furthest: -1, expected: [] }
 */
export const manyAtMost = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input, index = 0) => {
        const results: T[] = [];
        let at = index;
        let trace: Result<unknown> = success(null, index);

        for (let i = 0; i < n; i++) {
            const result: Result<T> = merge(trace, parser(input, at));
            trace = result;

            if (!result.ok) {
                break;
            }

            results.push(result.value);
            at = result.index;
        }

        return merge(trace, success(results, at));
    });
};
