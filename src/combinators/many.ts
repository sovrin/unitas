import { create, type Parser } from '../core/parser';
import { type Result } from '../core/result';
import { success, type Success } from '../core/success';

/**
 * Zero or more occurrences (never fails).
 *
 * The failure that stopped the loop is kept as a trace, so a later error can
 * still report what the repetition was expecting next.
 *
 * @example
 * many(char('a'))('aaa') // { ok: true, value: ['a', 'a', 'a'], index: 3 }
 */
export const many = <T>(parser: Parser<T>) => {
    return create<T[]>((input, index = 0, ctx): Success<T[]> => {
        const results: T[] = [];
        let at = index;

        while (true) {
            const result: Result<T> = parser(input, at, ctx);
            if (!result.ok) {
                break;
            }

            // Prevent infinite loop: ensure progress is made
            if (result.index === at) {
                break;
            }

            results.push(result.value);
            at = result.index;
        }

        return success(results, at) as Success<T[]>;
    });
};
