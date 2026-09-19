const NONE: readonly string[] = [];

/**
 * Per-parse bookkeeping for error messages: the furthest offset any branch
 * reached and what was wanted there.
 *
 * A parse can succeed while leaving input unconsumed, and a branch that failed
 * deep in the input can be backtracked over entirely. The context is what lets
 * the final error point at the real problem instead of wherever parsing
 * happened to stop. It only ever moves forward, so backtracking cannot lose it.
 */
export type Context = { furthest: number; expected: readonly string[] };

/**
 * Creates a fresh context. {@link run} and {@link parse} make one per call.
 *
 * @example
 * context() // { furthest: -1, expected: [] }
 */
export const context = (): Context => ({ furthest: -1, expected: NONE });

/**
 * Adds the entries of `b` to `a`, returning `a` itself when it already covers
 * them. Callers rely on that identity to skip allocating.
 *
 * @example
 * union(['digit'], ['digit']) // ['digit']
 */
export const union = (
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
 * Notes what was expected at an offset, keeping only the furthest one seen.
 *
 * Replaces `expected` rather than mutating it, so a parser may pass the same
 * array every time without it being altered underneath.
 *
 * @example
 * const ctx = context();
 * record(ctx, 3, ['digit']);
 * ctx // { furthest: 3, expected: ['digit'] }
 */
export const record = (
    ctx: Context | undefined,
    index: number,
    expected: readonly string[],
): void => {
    if (ctx === undefined) {
        return;
    }

    if (index > ctx.furthest) {
        ctx.furthest = index;
        ctx.expected = expected;

        return;
    }

    if (index < ctx.furthest || ctx.expected === expected) {
        return;
    }

    ctx.expected = union(ctx.expected, expected);
};
