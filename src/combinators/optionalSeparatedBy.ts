import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse items separated by a separator, allowing empty slots.
 *
 * @example
 * optionalSeparatedBy(digits, char(','))('1,2') // { ok: true, value: [1, 2], index: 3 }
 */
export const optionalSeparatedBy = <T>(
    parser: Parser<T>,
    separator: Parser,
) => {
    return create<(T | null)[]>((input, index = 0, ctx) => {
        const results: (T | null)[] = [];
        let at = index;

        const leadingSep = separator(input, at, ctx);

        if (leadingSep.ok) {
            results.push(null);
            at = leadingSep.index;
        }

        const firstResult: Result<T> = parser(input, at, ctx);
        if (firstResult.ok) {
            results.push(firstResult.value);
            at = firstResult.index;
        } else if (!leadingSep.ok) {
            return success([], index);
        }

        while (true) {
            const sepResult: Result<unknown> = separator(input, at, ctx);
            if (!sepResult.ok) {
                break;
            }
            at = sepResult.index;

            const nextResult: Result<T> = parser(input, at, ctx);
            if (!nextResult.ok) {
                break;
            }

            results.push(nextResult.value);
            at = nextResult.index;
        }

        return success(results, at);
    });
};
