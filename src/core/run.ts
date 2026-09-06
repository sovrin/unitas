import type { Parser } from './parser';

import { ParseError } from './error';
import { type Result } from './result';

/**
 * Resolves where a parse went wrong.
 *
 * A parser can succeed without consuming everything — the interesting position
 * is then the furthest offset any branch reached, not where the parse stopped.
 */
export const diagnose = <T>(
    input: string,
    result: Result<T>,
): { index: number; expected: readonly string[] } | null => {
    if (!result.ok) {
        return { index: result.index, expected: result.expected };
    }

    if (result.index === input.length) {
        return null;
    }

    if (result.furthest > result.index) {
        return { index: result.furthest, expected: result.expected };
    }

    const expected = result.furthest === result.index
        ? [...new Set([...result.expected, 'end of input'])]
        : ['end of input'];

    return { index: result.index, expected };
};

/**
 * Runs a parser over the whole input and returns the value.
 *
 * Throws a {@link ParseError} — with line, column and the expectations at that
 * point — if the parse fails or leaves input unconsumed.
 *
 * @example
 * run(string('hello'), 'hello') // 'hello'
 */
export const run = <T>(parser: Parser<T>, input: string): T => {
    const result = parser(input, 0);
    const problem = diagnose(input, result);

    if (problem) {
        throw new ParseError(input, problem.index, problem.expected);
    }

    return (result as { value: T }).value;
};
