export type Success<T> = { ok: true; value: T; remaining: string };

export const success = <T>(value: T, remaining: string): Success<T> => ({
    ok: true,
    value,
    remaining,
});
