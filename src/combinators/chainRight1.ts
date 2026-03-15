import type { Parser, Result } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

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
