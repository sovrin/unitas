import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Chain right-associative operations (fails on empty input).
 *
 * @example
 * chainRight1(digits, operation)('1+2+3') // { ok: true, value: 6, index: 5, furthest: 5, expected: ['operator'] }
 */
export const chainRight1 = <T>(
    term: Parser<T>,
    operator: Parser<(left: T, right: T) => T>,
) => {
    const parser: Parser<T> = create<T>((input, index = 0) => {
        const leftResult = term(input, index);
        if (!leftResult.ok) {
            return leftResult;
        }

        const opResult = merge(leftResult, operator(input, leftResult.index));
        if (!opResult.ok) {
            return merge(opResult, success(leftResult.value, leftResult.index));
        }

        const rightResult: Result<T> = merge(
            opResult,
            parser(input, opResult.index),
        );
        if (!rightResult.ok) {
            return merge(
                rightResult,
                success(leftResult.value, leftResult.index),
            );
        }

        return merge(
            rightResult,
            success(
                opResult.value(leftResult.value, rightResult.value),
                rightResult.index,
            ),
        );
    });

    return parser;
};
