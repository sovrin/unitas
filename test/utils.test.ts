import { create } from '../src/core/create';
import { success } from '../src/core/success';
import { failure } from '../src/core/failure';
import { assertType, expect } from 'vitest';
import { Result } from '../src/types';

export const createTestParser = <T extends string | number>(tester: T) => {
    return create<T>((input) => {
        const stringTester = String(tester);
        if (input.startsWith(stringTester)) {
            return success(tester, input.slice(stringTester.length));
        }

        return failure();
    });
};

export const assertResult = <T>(
    result: Result<T>,
    expected: Result<T> = null,
) => {
    assertType<Result<T>>(result);
    expect(result).toEqual(expected);
};

