import { type Result } from '../types';

export const match = <T, U>(
    result: Result<T>,
    branches: {
        success: (value: T, remaining: string) => U;
        failure: (error?: string) => U;
    },
): U => {
    return result.ok
        ? branches.success(result.value, result.remaining)
        : branches.failure(result.error);
};
