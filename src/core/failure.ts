import { type Context, record } from './context';

export type Failure = { ok: false; index: number; expected: readonly string[] };

/**
 * Creates a failed result at an offset and notes it in the parse context.
 *
 * Expectations are phrased as nouns ('digit', "'{'"). Pass the context through
 * from the parser so the message can name this position even if the branch is
 * later backtracked over.
 *
 * @example
 * failure(undefined, 3, 'digit') // { ok: false, index: 3, expected: ['digit'] }
 */
export const failure = (
    ctx: Context | undefined,
    index: number,
    ...expected: string[]
): Failure => {
    record(ctx, index, expected);

    return { ok: false, index, expected };
};

/**
 * Creates a failed result from an expectation list that is already allocated,
 * avoiding a fresh array on every failure.
 *
 * @example
 * const expected = ['digit'];
 * reject(undefined, 3, expected) // { ok: false, index: 3, expected: ['digit'] }
 */
export const reject = (
    ctx: Context | undefined,
    index: number,
    expected: readonly string[],
): Failure => {
    record(ctx, index, expected);

    return { ok: false, index, expected };
};
