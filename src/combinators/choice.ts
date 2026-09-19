import type { Parser } from '../core/parser';

import { union } from '../core/context';
import { create } from '../core/parser';
import { type Result } from '../core/result';

type ParserOutput<P> = P extends Parser<infer T> ? T : never;

const NONE: readonly string[] = [];

/**
 * Try each parser in order, return first success.
 *
 * Alternatives all start from the same offset, so the expectations of those
 * that failed there are unioned into the result. Anything they recorded deeper
 * in the input is already in the parse context.
 *
 * @example
 * choice(string('hello'), string('world'))('hello') // { ok: true, value: 'hello', index: 5 }
 */
export const choice = <const P extends readonly Parser<any>[]>(
    ...parsers: P
): Parser<ParserOutput<P[number]>> => {
    return create<ParserOutput<P[number]>>((input, index = 0, ctx) => {
        let expected: readonly string[] = NONE;

        for (const parser of parsers) {
            const result: Result<unknown> = parser(input, index, ctx);
            if (result.ok) {
                return result as Result<ParserOutput<P[number]>>;
            }

            if (result.index === index) {
                expected = union(expected, result.expected);
            }
        }

        return { ok: false, index, expected };
    });
};
