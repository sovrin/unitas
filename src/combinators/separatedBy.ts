import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
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
 * separatedBy(digits, char(','))('1,2,3') // { ok: true, value: [1, 2, 3], index: 5, furthest: 5, expected: ["','"] }
 */
export const separatedBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input, index = 0) => {
        const firstResult = parser(input, index);
        if (!firstResult.ok) {
            return merge(firstResult, success([], index));
        }

        const results = [firstResult.value];
        let at = firstResult.index;
        let trace: Result<unknown> = firstResult;

        while (true) {
            const sepResult: Result<unknown> = merge(trace, separator(input, at));
            trace = sepResult;
            if (!sepResult.ok) break;

            const nextResult: Result<T> = merge(trace, parser(input, sepResult.index));
            trace = nextResult;

            // If separator matched but parser failed, backtrack
            // Don't consume the separator
            if (!nextResult.ok) break;

            results.push(nextResult.value);
            at = nextResult.index;
        }

        return merge(trace, success(results, at));
    });
};
