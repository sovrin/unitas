import { type Result } from './result';

/**
 * Pattern matching on a Result to handle success and failure cases.
 *
 * @example
 * match(success('hello', ''), { success: (v) => v, failure: () => 'failed' }) // 'hello'
 */
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
