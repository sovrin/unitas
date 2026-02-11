import { create } from '../core/create';
import { success } from '../core/success';
import type { Parser } from '../types';

/**
 * zero or more
 */
export const separatedBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const firstResult = parser(input);
        if (!firstResult) {
            return success([], input);
        }

        const results = [firstResult[0]];
        let remaining = firstResult[1];

        while (true) {
            const sepResult = separator(remaining);
            if (!sepResult) break;

            const nextResult = parser(sepResult[1]);
            if (!nextResult) {
                // If separator matched but parser failed, backtrack
                // Don't consume the separator
                break;
            }

            results.push(nextResult[0]);
            remaining = nextResult[1];
        }

        return success(results, remaining);
    });
};
