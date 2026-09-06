import type { Parser } from '../core/parser';

import { failure } from './failure';
import { create } from './parser';

/**
 * Labels a parser with a custom error message on failure.
 *
 * @example
 * label(char('x'), 'letter x')('') // { ok: false, error: 'expected letter x' }
 */
export const label = <T>(parser: Parser<T>, expected: string): Parser<T> => {
    return create<T>((input) => {
        const result = parser(input);
        if (!result.ok) {
            return failure(`expected ${expected}`);
        }

        return result;
    });
};
