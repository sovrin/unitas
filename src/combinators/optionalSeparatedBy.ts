import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse items separated by a separator, allowing empty slots.
 *
 * A missing item before or between separators becomes `null`; an empty slot
 * after the last separator is dropped.
 *
 * @example
 * optionalSeparatedBy(digits, char(','))('1,2') // { ok: true, value: [1, 2], index: 3 }
 * optionalSeparatedBy(digits, char(','))('1,,2') // { ok: true, value: [1, null, 2], index: 4 }
 */
export const optionalSeparatedBy = <T>(
    parser: Parser<T>,
    separator: Parser,
) => {
    return create<(T | null)[]>((input, index = 0, ctx) => {
        const results: (T | null)[] = [];
        let at = index;
        let empty = false;

        const slot = () => {
            const result: Result<T> = parser(input, at, ctx);
            empty = !result.ok;
            if (result.ok) {
                results.push(result.value);
                at = result.index;
            } else {
                results.push(null);
            }
        };

        slot();

        while (true) {
            const start = at;
            const sepResult: Result<unknown> = separator(input, at, ctx);
            if (!sepResult.ok) {
                break;
            }
            at = sepResult.index;
            const wasEmpty = empty;
            slot();

            // Without progress this slot would repeat forever: drop it and stop.
            if (at === start) {
                results.pop();
                empty = wasEmpty;
                break;
            }
        }

        // An empty slot after the last separator is not an item.
        if (empty) {
            results.pop();
        }

        return success(results, at);
    });
};
