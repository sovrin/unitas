export type Success<T> = { ok: true; value: T; index: number };

/**
 * Creates a successful result with a value and the offset reached in the input.
 *
 * @example
 * success('hello', 5) // { ok: true, value: 'hello', index: 5 }
 */
export const success = <T>(value: T, index: number): Success<T> => ({
    ok: true,
    value,
    index,
});
