import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { chainLeft1 } from './chainLeft1';
import { optional } from './optional';

/**
 * Chain left-associative operations (right-to-left for same precedence).
 *
 * @example
 * chainLeft(digits, operation)('1+2+3') // { ok: true, value: 6, index: 5, furthest: 5, expected: ['operator'] }
 */
export const chainLeft = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
) => {
    return create<T | null>((input, index = 0) => {
        const result = optional(chainLeft1(parser, operator))(input, index);
        if (!result.ok || result.value === null) {
            return merge(result, failure(index));
        }

        return result;
    });
};
