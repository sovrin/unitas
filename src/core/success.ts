export type Success<T> = {
    ok: true;
    value: T;
    index: number;
    furthest: number;
    expected: readonly string[];
};

const NONE: readonly string[] = [];

/**
 * Creates a successful result with a value and the offset reached in the input.
 *
 * The `furthest`/`expected` pair carries the furthest failure seen while
 * producing this success, so a later error can still report it. Use
 * {@link merge} to propagate it — a fresh success starts with no trace.
 *
 * @example
 * success('hello', 5) // { ok: true, value: 'hello', index: 5, furthest: -1, expected: [] }
 */
export const success = <T>(value: T, index: number): Success<T> => ({
    ok: true,
    value,
    index,
    furthest: -1,
    expected: NONE,
});
