import type { Parser } from './parser';

import { type Context, context, union } from './context';
import { ParseError } from './error';
import { type Result } from './result';

/**
 * Folds in whatever the context recorded at the same offset, so expectations
 * from branches that were backtracked over are not lost.
 */
const merge = (
    ctx: Context,
    index: number,
    expected: readonly string[],
): readonly string[] => {
    return ctx.furthest === index ? union(ctx.expected, expected) : expected;
};

/**
 * Resolves where a parse went wrong.
 *
 * A parser can succeed without consuming everything — the interesting position
 * is then the furthest offset any branch reached, not where the parse stopped.
 *
 * A result reaching the same offset as the context carries no more authority
 * than the context does, so the two expectation sets are merged. Combinators
 * that fail without an expectation of their own — `chainLeft`, `guard`, a
 * hand-written `failure(ctx, index)` — would otherwise report nothing at all.
 */
export const diagnose = <T>(
    input: string,
    result: Result<T>,
    ctx: Context,
): { index: number; expected: readonly string[] } | null => {
    if (!result.ok) {
        if (ctx.furthest > result.index) {
            return { index: ctx.furthest, expected: ctx.expected };
        }

        return {
            index: result.index,
            expected: merge(ctx, result.index, result.expected),
        };
    }

    if (result.index === input.length) {
        return null;
    }

    if (ctx.furthest > result.index) {
        return { index: ctx.furthest, expected: ctx.expected };
    }

    return {
        index: result.index,
        expected: merge(ctx, result.index, ['end of input']),
    };
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
    const ctx = context();
    const result = parser(input, 0, ctx);
    const problem = diagnose(input, result, ctx);

    if (problem) {
        throw new ParseError(input, problem.index, problem.expected);
    }

    return (result as { value: T }).value;
};
