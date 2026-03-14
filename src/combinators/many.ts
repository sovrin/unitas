import type { Parser, Success } from '../types';

import { create } from '../core/create';
import { success } from '../core/success';

/**
 * zero or more occurrences
 */
export const many = <T>(parser: Parser<T>) => {
    return create<T[]>((input): Success<T[]> => {
        const results: T[] = [];
        let remaining = input;

        while (true) {
            const result = parser(remaining);
            if (!result) {
                break;
            }

            // Prevent infinite loop: ensure progress is made
            if (result[1] === remaining) {
                break;
            }

            results.push(result[0]);
            remaining = result[1];
        }

        return success(results, remaining);
    });
};
