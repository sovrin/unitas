import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Parse zero or more until terminator matches, leaving the terminator unconsumed.
 *
 * @example
 * until(char('a'), char('b'))('aaab') // { ok: true, value: ['a', 'a', 'a'], index: 3, furthest: 2, expected: ["'b'"] }
 */
export const until = <T, U>(parser: Parser<T>, terminator: Parser<U>) => {
    return create<T[]>((input, index = 0) => {
        const results: T[] = [];
        let at = index;
        let trace: Result<unknown> = success(null, index);

        while (true) {
            const termResult: Result<U> = merge(trace, terminator(input, at));
            if (termResult.ok) {
                break;
            }

            trace = termResult;

            const parseResult: Result<T> = merge(trace, parser(input, at));
            trace = parseResult;

            if (!parseResult.ok) {
                return parseResult;
            }

            results.push(parseResult.value);
            at = parseResult.index;
        }

        return merge(trace, success(results, at));
    });
};
