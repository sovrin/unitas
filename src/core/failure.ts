export type Failure = { ok: false; error?: string };

/**
 * Creates a failed result with an optional error message.
 *
 * @example
 * failure('unexpected input') // { ok: false, error: 'unexpected input' }
 */
export const failure = (error?: string): Failure => ({
    ok: false,
    error,
});
