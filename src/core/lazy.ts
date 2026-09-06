import type { Parser } from './parser';

import { create } from './parser';

/**
 * Defers parser creation, useful for recursive grammars.
 *
 * @example
 * lazy(() => char('a'))('abc') // { ok: true, value: 'a', index: 1, furthest: -1, expected: [] }
 */
export const lazy = <T>(thunk: () => Parser<T>) => {
    return create<T>((input, index = 0) => thunk()(input, index));
};
