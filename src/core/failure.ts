export type Failure = {
    ok: false;
    index: number;
    furthest: number;
    expected: readonly string[];
};

/**
 * Creates a failed result at an offset, describing what was expected there.
 *
 * Expectations are phrased as nouns ('digit', "'{'") and are unioned by
 * {@link choice}, so a failing alternation reports every branch it tried.
 *
 * @example
 * failure(3, 'digit') // { ok: false, index: 3, furthest: 3, expected: ['digit'] }
 */
export const failure = (index: number, ...expected: string[]): Failure => ({
    ok: false,
    index,
    furthest: index,
    expected,
});
