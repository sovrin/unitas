import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

/**
 * one or more
 */
export const chainLeft1 = <T>(
    term: Parser<T>,
    operator: Parser<(left: T, right: T) => T>,
) => {
    return create<T>((input) => {
        const firstResult = term(input);
        if (!firstResult.ok) return failure();

        let accumulator = firstResult.value;
        let remaining = firstResult.remaining;

        while (true) {
            const opResult = operator(remaining);
            if (!opResult.ok) break;

            const nextResult = term(opResult.remaining);
            if (!nextResult.ok) break;

            accumulator = opResult.value(accumulator, nextResult.value);
            remaining = nextResult.remaining;
        }

        return success(accumulator, remaining);
    });
};
