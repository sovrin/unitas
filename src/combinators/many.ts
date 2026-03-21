import { create, type Parser } from '../core/parser';
import { success, type Success } from '../core/success';

/**
 * Zero or more occurrences (never fails).
 *
 * @example
 * many(literal('a'))('aaa') // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
 */
export const many = <T>(parser: Parser<T>) => {
    return create<T[]>((input): Success<T[]> => {
        const results: T[] = [];
        let remaining = input;

        while (true) {
            const result = parser(remaining);
            if (!result.ok) {
                break;
            }

            // Prevent infinite loop: ensure progress is made
            if (result.remaining === remaining) {
                break;
            }

            results.push(result.value);
            remaining = result.remaining;
        }

        return success(results, remaining);
    });
};
