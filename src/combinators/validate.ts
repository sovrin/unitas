import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { merge } from '../core/merge';
import { create } from '../core/parser';

/**
 * Validate parsed value with a predicate.
 *
 * @example
 * validate(digit, (n) => n > 5)('7') // { ok: true, value: 7, index: 1, furthest: -1, expected: [] }
 * validate(digit, (n) => n > 5)('3') // { ok: false, index: 0, furthest: 0, expected: ['valid value'] }
 */
export const validate = <T>(
    parser: Parser<T>,
    predicate: (value: T) => boolean,
    expected = 'valid value',
) => {
    return create<T>((input, index = 0) => {
        const result = parser(input, index);
        if (!result.ok) return result;

        return predicate(result.value)
            ? result
            : merge(result, failure(index, expected));
    });
};
