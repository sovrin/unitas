import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Always return a value without consuming input.
 *
 * @example
 * pure(42)('abc') // { ok: true, value: 42, remaining: 'abc' }
 * pure('ok')('') // { ok: true, value: 'ok', remaining: '' }
 */
export const pure = <T>(value: T): Parser<T> => {
    return create<T>((input) => success(value, input));
};
