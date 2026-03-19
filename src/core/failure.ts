export type Failure = { ok: false; error?: string };

export const failure = (error?: string): Failure => ({
    ok: false,
    error,
});
