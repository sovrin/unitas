import type { Parser } from '../core/parser';

import { create } from './parser';

/**
 * Defers parser creation, useful for recursive grammars.
 *
 * @example
 * lazy(() => char('a'))('abc') // { ok: true, value: 'a', remaining: 'bc' }
 */
export const lazy = <T>(thunk: () => Parser<T>) => {
    return create<T>((input) => thunk()(input));
};
