import { assertType, expect } from 'vitest';

import { failure } from '../src/core/failure';
import { create } from '../src/core/parser';
import { type Result } from '../src/core/result';
import { success } from '../src/core/success';

export const createTestParser = <T extends string | number>(tester: T) => {
    const stringTester = String(tester);

    return create<T>((input, index = 0) => {
        if (input.startsWith(stringTester, index)) {
            return success(tester, index + stringTester.length);
        }

        return failure(undefined, index, stringTester);
    });
};

/**
 * Asserts a parser succeeded with a value, having consumed up to `index`.
 *
 * The furthest-failure trace is deliberately not asserted: it is bookkeeping
 * for error messages, not part of a parser's contract.
 */
export const assertSuccess = <T>(
    result: Result<T>,
    value: T,
    index: number,
) => {
    assertType<Result<T>>(result);

    expect(result.ok).toBe(true);
    expect((result as { value: T }).value).toEqual(value);
    expect(result.index).toBe(index);
};

/**
 * Asserts a parser failed, optionally at a given offset and with given
 * expectations.
 */
export const assertFailure = <T>(
    result: Result<T>,
    index?: number,
    expected?: readonly string[],
) => {
    assertType<Result<T>>(result);

    expect(result.ok).toBe(false);

    if (index !== undefined) {
        expect(result.index).toBe(index);
    }

    if (expected !== undefined) {
        const actual = (result as { expected: readonly string[] }).expected;
        expect([...actual].sort()).toEqual([...expected].sort());
    }
};
