import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { chainRight1 } from './chainRight1';
import { optional } from './optional';

/**
 * Chain right-associative operations (right-to-left grouping).
 *
 * @example
 * chainRight(digits, operation)('2-1-1') // { ok: true, value: 2, remaining: '' }
 * chainRight(digits, operation)('4/2/2') // { ok: true, value: 4, remaining: '' }
 */
export const chainRight = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
) => {
    return create<T | null>((input) => {
        const result = optional(chainRight1(parser, operator))(input);
        if (!result.ok || result.value === null) {
            return failure();
        }

        return result;
    });
};
