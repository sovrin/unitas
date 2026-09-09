import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Always succeed with a value without consuming input.
 *
 * @example
 * pure(42)('abc') // { ok: true, value: 42, index: 0 }
 */
export const pure = <T>(value: T): Parser<T> => {
    return create<T>((_input, index = 0) => success(value, index));
};
