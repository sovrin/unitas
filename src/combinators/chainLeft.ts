import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { chainLeft1 } from './chainLeft1';
import { optional } from './optional';

/**
 * Chain left-associative operations (right-to-left for same precedence).
 *
 * @example
 * chainLeft(digits, operation)('1+2+3') // { ok: true, value: 6, remaining: '' }
 * chainLeft(digits, operation)('10-3+2') // { ok: true, value: 9, remaining: '' }
 */
export const chainLeft = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
) => {
    return create<T | null>((input) => {
        const result = optional(chainLeft1(parser, operator))(input);
        if (!result.ok || result.value === null) {
            return failure();
        }

        return result;
    });
};
