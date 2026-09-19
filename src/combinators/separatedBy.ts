import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse zero or more items separated by a separator.
 *
 * A trailing separator is not consumed: if the separator matches but the item
 * after it does not, the list ends before the separator.
 *
 * @example
 * separatedBy(digits, char(','))('1,2,3') // { ok: true, value: [1, 2, 3], index: 5 }
 */
export const separatedBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input, index = 0, ctx) => {
        const firstResult = parser(input, index, ctx);
        if (!firstResult.ok) {
            return success([], index);
        }

        const results = [firstResult.value];
        let at = firstResult.index;

        while (true) {
            const sepResult: Result<unknown> = separator(input, at, ctx);
            if (!sepResult.ok) break;

            const nextResult: Result<T> = parser(input, sepResult.index, ctx);
            // If separator matched but parser failed, backtrack
            // Don't consume the separator
            if (!nextResult.ok) break;

            results.push(nextResult.value);
            at = nextResult.index;
        }

        return success(results, at);
    });
};
