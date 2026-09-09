import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';

/**
 * Conditionally apply parser based on a condition.
 *
 * @example
 * guard(true, string('hello'))('hello') // { ok: true, value: 'hello', index: 5 }
 * guard(false, string('hello'))('hello') // { ok: false, index: 0, expected: [] }
 */
export const guard = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input, index = 0, ctx) => {
        if (!condition) {
            return failure(ctx, index);
        }

        return parser(input, index, ctx);
    });
};
