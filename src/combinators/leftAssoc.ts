import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import type { Parser } from '../types';

export const leftAssoc = <T>(
    term: Parser<T>,
    operator: Parser<(left: T, right: T) => T>,
) => {
    return create<T>((input) => {
        const firstResult = term(input);
        if (!firstResult) return failure();

        let [accumulator, remaining] = firstResult;

        while (true) {
            const opResult = operator(remaining);
            if (!opResult) break;

            const nextResult = term(opResult[1]);
            if (!nextResult) break;

            accumulator = opResult[0](accumulator, nextResult[0]);
            remaining = nextResult[1];
        }

        return success(accumulator, remaining);
    });
};
