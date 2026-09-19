import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Chain left-associative operations (fails on empty input).
 *
 * @example
 * chainLeft1(digits, operation)('1+2+3') // { ok: true, value: 6, index: 5 }
 * chainLeft1(digits, operation)('8/2*3') // { ok: true, value: 12, index: 5 }
 */
export const chainLeft1 = <T>(
    term: Parser<T>,
    operator: Parser<(left: T, right: T) => T>,
) => {
    return create<T>((input, index = 0, ctx) => {
        const firstResult = term(input, index, ctx);
        if (!firstResult.ok) {
            return firstResult;
        }

        let accumulator = firstResult.value;
        let at = firstResult.index;

        while (true) {
            const opResult: Result<(left: T, right: T) => T> = operator(
                input,
                at,
                ctx,
            );
            if (!opResult.ok) break;

            const nextResult: Result<T> = term(input, opResult.index, ctx);
            if (!nextResult.ok) break;

            accumulator = opResult.value(accumulator, nextResult.value);
            at = nextResult.index;
        }

        return success(accumulator, at);
    });
};
