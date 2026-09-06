import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Chain left-associative operations (fails on empty input).
 *
 * @example
 * chainLeft1(digits, operation)('1+2+3') // { ok: true, value: 6, index: 5, furthest: 5, expected: ['operator'] }
 * chainLeft1(digits, operation)('8/2*3') // { ok: true, value: 12, index: 5, furthest: 5, expected: ['operator'] }
 */
export const chainLeft1 = <T>(
    term: Parser<T>,
    operator: Parser<(left: T, right: T) => T>,
) => {
    return create<T>((input, index = 0) => {
        const firstResult = term(input, index);
        if (!firstResult.ok) {
            return firstResult;
        }

        let accumulator = firstResult.value;
        let at = firstResult.index;
        let trace: Result<unknown> = firstResult;

        while (true) {
            const opResult: Result<(left: T, right: T) => T> = merge(trace, operator(input, at));
            trace = opResult;
            if (!opResult.ok) break;

            const nextResult: Result<T> = merge(trace, term(input, opResult.index));
            trace = nextResult;
            if (!nextResult.ok) break;

            accumulator = opResult.value(accumulator, nextResult.value);
            at = nextResult.index;
        }

        return merge(trace, success(accumulator, at));
    });
};
