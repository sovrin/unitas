import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { chainLeft1 } from './chainLeft1';
import { optional } from './optional';

/**
 * Chain left-associative operations: `1-2-3` is evaluated as `(1-2)-3`.
 *
 * Zero or more terms: succeeds with `null` when there is no term at all.
 *
 * @example
 * chainLeft(digits, operation)('1+2+3') // { ok: true, value: 6, index: 5 }
 * chainLeft(digits, operation)('') // { ok: true, value: null, index: 0 }
 */
export const chainLeft = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
) => {
    return create<T | null>(optional(chainLeft1(parser, operator)));
};
