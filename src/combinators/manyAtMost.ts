import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse at most n occurrences (never fails).
 *
 * @example
 * manyAtMost(char('a'), 2)('aaa') // { ok: true, value: ['a', 'a'], index: 2 }
 */
export const manyAtMost = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input, index = 0, ctx) => {
        const results: T[] = [];
        let at = index;

        for (let i = 0; i < n; i++) {
            const result: Result<T> = parser(input, at, ctx);
            if (!result.ok) {
                break;
            }

            results.push(result.value);
            at = result.index;
        }

        return success(results, at);
    });
};
