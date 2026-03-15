import type { Parser } from '../types';

import { create } from '../core/create';
import { success } from '../core/success';

/**
 * zero or more
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
