import type { Parser } from '../core/parser';

import { create } from '../core/parser';

/**
 * Attempt wraps a parser to handle backtracking on failure.
 *
 * @example
 * attempt(string('hello'))('hello world') // { ok: true, value: 'hello', remaining: ' world' }
 */
export const attempt = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        return result;
    });
};
