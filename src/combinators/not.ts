import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Succeed if parser fails (without consuming input).
 *
 * The inner failure is deliberately not traced: it is the expected outcome, so
 * reporting it would produce a misleading expectation.
 *
 * @example
 * not(string('hello'))('world') // { ok: true, value: null, index: 0, furthest: -1, expected: [] }
 */
export const not = <T>(parser: Parser<T>) => {
    return create<null>((input, index = 0) => {
        const result = parser(input, index);

        return result.ok ? failure(index) : success(null, index);
    });
};
