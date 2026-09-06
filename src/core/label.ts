import type { Parser } from './parser';

import { failure } from './failure';
import { create } from './parser';

/**
 * Replaces the expectations of a parser with a single description.
 *
 * Only applies when the parser failed without consuming input: once a branch
 * has committed, its own deeper error is more useful than the label.
 *
 * @example
 * label(char('x'), 'letter x')('') // { ok: false, index: 0, furthest: 0, expected: ['letter x'] }
 */
export const label = <T>(parser: Parser<T>, expected: string): Parser<T> => {
    return create<T>((input, index = 0) => {
        const result = parser(input, index);
        if (result.ok || result.index > index) {
            return result;
        }

        return failure(index, expected);
    });
};
