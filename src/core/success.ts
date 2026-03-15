import type { Success } from '../types';

export const success = <T>(value: T, remaining: string): Success<T> => ({
    ok: true,
    value,
    remaining,
});
