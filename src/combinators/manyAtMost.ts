import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse at most n occurrences.
 *
 * @example
 * manyAtMost(literal('a'), 2)('aaa') // { ok: true, value: ['a', 'a'], remaining: 'a' }
 */
export const manyAtMost = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        for (let i = 0; i < n; i++) {
            const result = parser(remaining);
            if (!result.ok) {
                break;
            }

            results.push(result.value);
            remaining = result.remaining;
        }

        return success(results, remaining);
    });
};
