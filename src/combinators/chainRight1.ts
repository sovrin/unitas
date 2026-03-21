import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * @example
 * chain right-associative operations (fails on empty input)
 * chainRight1(digits, operation)('2-1-1') // { ok: true, value: 2, remaining: '' }
 * chainRight1(digits, operation)('4/2/2') // { ok: true, value: 4, remaining: '' }
 */
export const chainRight1 = <T>(
    term: Parser<T>,
    operator: Parser<(left: T, right: T) => T>,
) => {
    return create<T>((input) => {
        const leftResult = term(input);
        if (!leftResult.ok) return failure();

        const tryRightSide = (leftValue: T, remaining: string): Result<T> => {
            const opResult = operator(remaining);
            if (!opResult.ok) return success(leftValue, remaining);

            const rightResult = chainRight1(term, operator)(opResult.remaining);
            if (!rightResult.ok) return success(leftValue, remaining);

            const combinedValue = opResult.value(leftValue, rightResult.value);
            return success(combinedValue, rightResult.remaining);
        };

        return tryRightSide(leftResult.value, leftResult.remaining);
    });
};
