import { merge } from '../core/merge';
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
 * many(char('a'))('aaa') // { ok: true, value: ['a', 'a', 'a'], index: 3, furthest: 3, expected: ["'a'"] }
 */
export const many = <T>(parser: Parser<T>) => {
    return create<T[]>((input, index = 0): Success<T[]> => {
        const results: T[] = [];
        let at = index;
        let trace: Result<unknown> = success(null, index);

        while (true) {
            const result: Result<T> = merge(trace, parser(input, at));
            trace = result;

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

        return merge(trace, success(results, at)) as Success<T[]>;
    });
};
