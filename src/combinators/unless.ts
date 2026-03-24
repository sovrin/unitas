import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse unless condition is true (inverse of guard).
 *
 * @example
 * unless(false, string('hello'))('hello') // { ok: true, value: 'hello', remaining: '' }
 * unless(true, string('hello'))('hello') // { ok: true, value: null, remaining: 'hello' }
 */
export const unless = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input) => {
        return !condition ? parser(input) : success(null, input);
    });
};
