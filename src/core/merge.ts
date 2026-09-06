import { type Result } from './result';

/**
 * Adds the expectations of `b` to `a`, returning `a` itself when it already
 * covers them. Callers rely on that identity to skip allocating.
 */
const union = (
    a: readonly string[],
    b: readonly string[],
): readonly string[] => {
    if (b.length === 0 || a === b) return a;
    if (a.length === 0) return b;

    let extra: string[] | null = null;
    for (const item of b) {
        if (!a.includes(item)) {
            (extra ??= []).push(item);
        }
    }

    return extra ? [...a, ...extra] : a;
};

/**
 * Carries the furthest-failure trace of an earlier result into a later one.
 *
 * Every combinator that runs more than one parser threads its intermediate
 * results through `merge`, so an expectation recorded deep inside a branch that
 * was later backtracked over still surfaces in the final error. Without it,
 * `a=1,b=x` would only report "unconsumed input" instead of "expected digit".
 *
 * Returns `result` untouched whenever the trace adds nothing, which is the
 * common case and keeps the hot path allocation-free.
 *
 * @example
 * merge(failure(7, 'digit'), success('ok', 3)) // { ok: true, value: 'ok', index: 3, furthest: 7, expected: ['digit'] }
 */
export const merge = <T>(
    trace: Result<unknown>,
    result: Result<T>,
): Result<T> => {
    const { furthest } = trace;
    // `furthest >= 0` also rejects a trace that carries no bookkeeping at all,
    // so a hand-built result cannot crash the merge.
    if (!(furthest >= 0) || furthest < result.furthest) {
        return result;
    }

    if (furthest > result.furthest) {
        const { expected } = trace;

        return result.ok
            ? { ...result, furthest, expected }
            : { ...result, index: furthest, furthest, expected };
    }

    const expected = union(result.expected, trace.expected);

    return expected === result.expected ? result : { ...result, expected };
};
