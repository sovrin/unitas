export type Success<T> = { ok: true; value: T; remaining: string };

/**
 * Creates a successful result with a value and remaining input.
 *
 * @example
 * success('hello', ' world') // { ok: true, value: 'hello', remaining: ' world' }
 */
export const success = <T>(value: T, remaining: string): Success<T> => ({
    ok: true,
    value,
    remaining,
});
