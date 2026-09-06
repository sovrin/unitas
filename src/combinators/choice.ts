import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

type ParserOutput<P> = P extends Parser<infer T> ? T : never;

/**
 * Try each parser in order, return first success.
 *
 * Expectations from every alternative tried at the same offset are unioned, so
 * a failing alternation reports all of them rather than only the last.
 *
 * @example
 * choice(string('hello'), string('world'))('hello') // { ok: true, value: 'hello', index: 5, furthest: -1, expected: [] }
 */
export const choice = <const P extends readonly Parser<any>[]>(
    ...parsers: P
): Parser<ParserOutput<P[number]>> => {
    return create<ParserOutput<P[number]>>((input, index = 0) => {
        let trace: Result<unknown> = success(null, index);

        for (const parser of parsers) {
            const result: Result<unknown> = merge(trace, parser(input, index));
            if (result.ok) {
                return result as Result<ParserOutput<P[number]>>;
            }

            trace = result;
        }

        return trace.ok ? failure(index) : trace;
    });
};
