import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse zero or more until terminator matches.
 *
 * @example
 * manyTill(char('a'), char('b'))('aaab') // { ok: true, value: ['a', 'a', 'a'], index: 4 }
 */
export const manyTill = <T, U>(parser: Parser<T>, terminator: Parser<U>) => {
    return create<T[]>((input, index = 0, ctx) => {
        const results: T[] = [];
        let at = index;

        while (true) {
            const termResult: Result<U> = terminator(input, at, ctx);
            if (termResult.ok) {
                return success(results, termResult.index);
            }
            const parseResult: Result<T> = parser(input, at, ctx);
            if (!parseResult.ok) {
                return parseResult;
            }

            results.push(parseResult.value);
            at = parseResult.index;
        }
    });
};
