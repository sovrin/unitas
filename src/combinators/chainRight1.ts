import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import type { Parser, Result } from '../types';

export const chainRight1 = <T>(
    term: Parser<T>,
    operator: Parser<(left: T, right: T) => T>,
) => {
    return create<T>((input) => {
        const leftResult = term(input);
        if (!leftResult) return failure();

        const tryRightSide = (leftValue: T, remaining: string): Result<T> => {
            const opResult = operator(remaining);
            if (!opResult) return success(leftValue, remaining);

            const rightResult = chainRight1(term, operator)(opResult[1]);
            if (!rightResult) return success(leftValue, remaining);

            const combinedValue = opResult[0](leftValue, rightResult[0]);
            return success(combinedValue, rightResult[1]);
        };

        return tryRightSide(leftResult[0], leftResult[1]);
    });
};
