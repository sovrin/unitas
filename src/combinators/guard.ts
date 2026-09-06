import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';

/**
 * Conditionally apply parser based on a condition.
 *
 * @example
 * guard(true, string('hello'))('hello') // { ok: true, value: 'hello', remaining: '' }
 * guard(false, string('hello'))('hello') // { ok: false }
 */
export const guard = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input) => {
        if (!condition) {
            return failure();
        }

        const result = parser(input);

        return result;
    });
};
