import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse items separated by a separator, allowing empty slots.
 *
 * @example
 * optionalSeparatedBy(digits, char(','))('1,2') // { ok: true, value: [1, 2], index: 3, furthest: 3, expected: ["','"] }
 */
export const optionalSeparatedBy = <T>(
    parser: Parser<T>,
    separator: Parser,
) => {
    return create<(T | null)[]>((input, index = 0) => {
        const results: (T | null)[] = [];
        let at = index;

        const leadingSep = separator(input, at);
        let trace: Result<unknown> = leadingSep;

        if (leadingSep.ok) {
            results.push(null);
            at = leadingSep.index;
        }

        const firstResult: Result<T> = merge(trace, parser(input, at));
        trace = firstResult;

        if (firstResult.ok) {
            results.push(firstResult.value);
            at = firstResult.index;
        } else if (!leadingSep.ok) {
            return merge(trace, success([], index));
        }

        while (true) {
            const sepResult: Result<unknown> = merge(trace, separator(input, at));
            trace = sepResult;
            if (!sepResult.ok) {
                break;
            }
            at = sepResult.index;

            const nextResult: Result<T> = merge(trace, parser(input, at));
            trace = nextResult;
            if (!nextResult.ok) {
                break;
            }

            results.push(nextResult.value);
            at = nextResult.index;
        }

        return merge(trace, success(results, at));
    });
};
