import { assertType, expect } from 'vitest';

import { failure } from '../src/core/failure';
import { create } from '../src/core/parser';
import { type Result } from '../src/core/result';
import { success } from '../src/core/success';

export const createTestParser = <T extends string | number>(tester: T) => {
    return create<T>((input) => {
        const stringTester = String(tester);
        if (input.startsWith(stringTester)) {
            return success(tester, input.slice(stringTester.length));
        }

        return failure();
    });
};

export const assertSuccess = <T>(
    result: Result<T>,
    value: T,
    remaining: string,
) => {
    assertType<Result<T>>(result);

    expect(result).toEqual({
        ok: true,
        value,
        remaining,
    });
};

export const assertFailure = <T>(result: Result<T>, error?: string) => {
    assertType<Result<T>>(result);

    expect(result).toEqual({
        ok: false,
        error,
    });
};
