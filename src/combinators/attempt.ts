import type { Parser } from '../core/parser';

import { forward } from '../core/forward';
import { create } from '../core/parser';

/**
 * @example
 * attempt wraps a parser to handle backtracking on failure
 * attempt(literal('hello'))('hello world') // { ok: true, value: 'hello', remaining: ' world' }
 */
export const attempt = <T>(parser: Parser<T>) => {
    return create<T>((input) => {
        const result = parser(input);

        return forward(result);
    });
};
