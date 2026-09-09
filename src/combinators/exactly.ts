import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse exactly n occurrences.
 *
 * @example
 * exactly(char('a'), 3)('aaa') // { ok: true, value: ['a', 'a', 'a'], index: 3 }
 */
export const exactly = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input, index = 0, ctx) => {
        const results: T[] = [];
        let at = index;

        for (let i = 0; i < n; i++) {
            const result: Result<T> = parser(input, at, ctx);
            if (!result.ok) {
                return result;
            }

            results.push(result.value);
            at = result.index;
        }

        return success(results, at);
    });
};
