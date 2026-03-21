import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Zero or more items separated by a separator.
 *
 * @example
 * separatedBy(literal('a'), literal(','))('a,a,a') // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
 */
export const separatedBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const firstResult = parser(input);
        if (!firstResult.ok) {
            return success([], input);
        }

        const results = [firstResult.value];
        let remaining = firstResult.remaining;

        while (true) {
            const sepResult = separator(remaining);
            if (!sepResult.ok) break;

            const nextResult = parser(sepResult.remaining);
            if (!nextResult.ok) {
                // If separator matched but parser failed, backtrack
                // Don't consume the separator
                break;
            }

            results.push(nextResult.value);
            remaining = nextResult.remaining;
        }

        return success(results, remaining);
    });
};
