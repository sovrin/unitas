import type { Parser } from './parser';

import { create } from './parser';

/**
 * Defers parser creation, useful for recursive grammars.
 *
 * @example
 * lazy(() => char('a'))('abc') // { ok: true, value: 'a', index: 1 }
 */
export const lazy = <T>(thunk: () => Parser<T>) => {
    return create<T>((input, index = 0, ctx) => thunk()(input, index, ctx));
};
