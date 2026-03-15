import type { Failure } from '../types';

export const failure = (error?: string): Failure => ({
    ok: false,
    error,
});
