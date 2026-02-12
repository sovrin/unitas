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

export const numberParser = create<number>((value: string) => {
    const [, match, rest] = value.match(/^(\d+)(.*)/) || ['0'];
    if (!match) return failure();

    return success<number>(parseInt(match), rest);
});

export const operatorParser = create((input) => {
    const ops: Record<string, (left: number, right: number) => number> = {
        '+': (left, right) => left + right,
        '-': (left, right) => left - right,
        '*': (left, right) => left * right,
        '/': (left, right) => left / right,
        '**': (left, right) => Math.pow(left, right),
    };

    const [operator] = input.match(/\*\*|[+\-*/]/) || [];
    if (!operator) return failure();

    const operation = ops[operator];
    if (!operation) return failure();

    return success(operation, input.slice(operator.length));
});

export const assertResult = <T>(
    result: Result<T>,
    expected: Result<T> = null,
) => {
    assertType<Result<T>>(result);
    expect(result).toEqual(expected);
};
