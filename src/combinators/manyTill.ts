import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse zero or more until terminator matches.
 *
 * @example
 * manyTill(char('a'), char('b'))('aaab') // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
 */
export const manyTill = <T, U>(parser: Parser<T>, terminator: Parser<U>) => {
    return create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        while (true) {
            const termResult = terminator(remaining);
            if (termResult.ok) {
                return success(results, termResult.remaining);
            }

            const parseResult = parser(remaining);
            if (!parseResult.ok) {
                return failure();
            }

            results.push(parseResult.value);
            remaining = parseResult.remaining;
        }
    });
};
