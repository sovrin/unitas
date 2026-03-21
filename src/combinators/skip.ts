import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Skip a parser n times.
 *
 * @example
 * skip(literal('a'), 2)('aabc') // { ok: true, value: null, remaining: 'bc' }
 */
export const skip = <T>(parser: Parser<T>, count: number) => {
    return create<null>((input) => {
        let remaining = input;

        for (let i = 0; i < count; i++) {
            const result = parser(remaining);
            if (!result.ok) {
                return failure();
            }
            remaining = result.remaining;
        }

        return success(null, remaining);
    });
};
