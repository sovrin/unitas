import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Chain right-associative operations (fails on empty input).
 *
 * @example
 * chainRight1(digits, operation)('1+2+3') // { ok: true, value: 6, index: 5 }
 */
export const chainRight1 = <T>(
    term: Parser<T>,
    operator: Parser<(left: T, right: T) => T>,
) => {
    const parser: Parser<T> = create<T>((input, index = 0, ctx) => {
        const leftResult = term(input, index, ctx);
        if (!leftResult.ok) {
            return leftResult;
        }

        const opResult = operator(input, leftResult.index, ctx);
        if (!opResult.ok) {
            return success(leftResult.value, leftResult.index);
        }

        const rightResult: Result<T> = parser(input, opResult.index, ctx);
        if (!rightResult.ok) {
            return success(leftResult.value, leftResult.index);
        }

        return success(
            opResult.value(leftResult.value, rightResult.value),
            rightResult.index,
        );
    });

    return parser;
};
