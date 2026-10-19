import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { chainRight1 } from './chainRight1';
import { optional } from './optional';

/**
 * Chain right-associative operations: `2^3^2` is evaluated as `2^(3^2)`.
 *
 * Zero or more terms: succeeds with `null` when there is no term at all.
 *
 * @example
 * chainRight(digits, operation)('1+2+3') // { ok: true, value: 6, index: 5 }
 * chainRight(digits, operation)('') // { ok: true, value: null, index: 0 }
 */
export const chainRight = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
) => {
    return create<T | null>(optional(chainRight1(parser, operator)));
};
