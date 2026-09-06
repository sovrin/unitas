import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse unless condition is true (inverse of guard).
 *
 * @example
 * unless(false, string('hello'))('hello') // { ok: true, value: 'hello', index: 5, furthest: -1, expected: [] }
 * unless(true, string('hello'))('hello') // { ok: true, value: null, index: 0, furthest: -1, expected: [] }
 */
export const unless = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input, index = 0) => {
        return !condition ? parser(input, index) : success(null, index);
    });
};
