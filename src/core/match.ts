import { type Result } from './result';

/**
 * Pattern matching on a Result to handle success and failure cases.
 *
 * @example
 * match(success('hello', 5), { success: (v) => v, failure: () => 'failed' }) // 'hello'
 */
export const match = <T, U>(
    result: Result<T>,
    branches: {
        success: (value: T, index: number) => U;
        failure: (index: number, expected: readonly string[]) => U;
    },
): U => {
    return result.ok
        ? branches.success(result.value, result.index)
        : branches.failure(result.index, result.expected);
};
