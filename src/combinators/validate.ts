import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';

/**
 * Validate parsed value with a predicate.
 *
 * @example
 * validate(digit, (n) => n > 5)('7') // { ok: true, value: 7, index: 1 }
 * validate(digit, (n) => n > 5)('3') // { ok: false, index: 0, expected: ['valid value'] }
 */
export const validate = <T>(
    parser: Parser<T>,
    predicate: (value: T) => boolean,
    expected = 'valid value',
) => {
    return create<T>((input, index = 0, ctx) => {
        const result = parser(input, index, ctx);
        if (!result.ok) return result;

        return predicate(result.value) ? result : failure(ctx, index, expected);
    });
};
