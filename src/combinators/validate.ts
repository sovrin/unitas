import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';

/**
 * Validate parsed value with a predicate.
 *
 * @example
 * validate(digit, (n) => n > 5)('7') // { ok: true, value: 7, remaining: '' }
 * validate(digit, (n) => n > 5)('3') // { ok: false }
 */
export const validate = <T>(
    parser: Parser<T>,
    predicate: (value: T) => boolean,
) => {
    return create<T>((input) => {
        const result = parser(input);
        if (!result.ok) return failure();

        return predicate(result.value) ? result : failure();
    });
};
