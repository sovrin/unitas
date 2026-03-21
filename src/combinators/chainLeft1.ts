import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Chain left-associative operations (fails on empty input).
 *
 * @example
 * chainLeft1(digits, operation)('1+2+3') // { ok: true, value: 6, remaining: '' }
 * chainLeft1(digits, operation)('8/2*3') // { ok: true, value: 12, remaining: '' }
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
