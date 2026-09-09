import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { chainLeft1 } from './chainLeft1';
import { optional } from './optional';

/**
 * Chain left-associative operations (right-to-left for same precedence).
 *
 * @example
 * chainLeft(digits, operation)('1+2+3') // { ok: true, value: 6, index: 5 }
 */
export const chainLeft = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
) => {
    return create<T | null>((input, index = 0, ctx) => {
        const result = optional(chainLeft1(parser, operator))(
            input,
            index,
            ctx,
        );
        if (!result.ok || result.value === null) {
            return failure(ctx, index);
        }

        return result;
    });
};
