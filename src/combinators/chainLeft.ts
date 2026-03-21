import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { forward } from '../core/forward';
import { create } from '../core/parser';
import { chainLeft1 } from './chainLeft1';
import { optional } from './optional';

/**
 * @example
 * chain left-associative operations like 1+2+3 => ((1+2)+3)
 * chainLeft(digit, operation)('1+2+3') // { ok: true, value: 6, remaining: '' }
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

        return forward(result);
    });
};
