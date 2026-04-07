import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Zero or more items separated by a separator, with optional null values.
 *
 * @example
 * optionalSeparatedBy(digits, char(','))('1,2') // { ok: true, value: [1, 2], remaining: '' }
 * optionalSeparatedBy(digits, char(','))(',1') // { ok: true, value: [null, 1], remaining: '' }
 * optionalSeparatedBy(digits, char(','))('1,') // { ok: true, value: [1], remaining: '' }
 */
export const optionalSeparatedBy = <T>(
    parser: Parser<T>,
    separator: Parser,
) => {
    return create<(T | null)[]>((input) => {
        const results: (T | null)[] = [];
        let remaining = input;

        const leadingSep = separator(remaining);
        if (leadingSep.ok) {
            results.push(null);
            remaining = leadingSep.remaining;
        }

        const firstResult = parser(remaining);
        if (firstResult.ok) {
            results.push(firstResult.value);
            remaining = firstResult.remaining;
        } else if (!leadingSep.ok) {
            return success([], input);
        }

        while (true) {
            const sepResult = separator(remaining);
            if (!sepResult.ok) {
                break;
            }
            remaining = sepResult.remaining;

            const nextResult = parser(remaining);
            if (!nextResult.ok) {
                break;
            }

            results.push(nextResult.value);
            remaining = nextResult.remaining;
        }

        return success(results, remaining);
    });
};
