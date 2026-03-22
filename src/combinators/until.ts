import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse until terminator matches (fails if terminator never matches).
 *
 * @example
 * until(char('a'), char('b'))('baaa') // { ok: true, value: [], remaining: 'baaa' }
 * until(char('a'), char('b'))('aaba') // { ok: true, value: ['a', 'a'], remaining: 'ba' }
 */
export const until = <T, U>(parser: Parser<T>, terminator: Parser<U>) => {
    return create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        while (true) {
            const termResult = terminator(remaining);
            if (termResult.ok) {
                break;
            }

            const parseResult = parser(remaining);
            if (!parseResult.ok) {
                return failure();
            }

            results.push(parseResult.value);
            remaining = parseResult.remaining;
        }

        return success(results, remaining);
    });
};
