import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse zero or more until terminator matches, leaving the terminator unconsumed.
 *
 * @example
 * until(char('a'), char('b'))('aaab') // { ok: true, value: ['a', 'a', 'a'], index: 3 }
 */
export const until = <T, U>(parser: Parser<T>, terminator: Parser<U>) => {
    return create<T[]>((input, index = 0, ctx) => {
        const results: T[] = [];
        let at = index;

        while (true) {
            const termResult: Result<U> = terminator(input, at, ctx);
            if (termResult.ok) {
                break;
            }
            const parseResult: Result<T> = parser(input, at, ctx);
            if (!parseResult.ok) {
                return parseResult;
            }

            results.push(parseResult.value);
            at = parseResult.index;
        }

        return success(results, at);
    });
};
