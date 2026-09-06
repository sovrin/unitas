import { many1 } from '../combinators/many1';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';
import { whitespace } from './whitespace';

const parser = many1(whitespace);

/**
 * Parse one or more whitespaces as a string.
 *
 * @example
 * whitespaces('placeholder') // { ok: false, index: 0, furthest: 0, expected: ['whitespace'] }
 */
export const whitespaces = create<string>((input, index = 0) => {
    const result = parser(input, index);
    if (!result.ok) {
        return result;
    }

    return merge(result, success(result.value.join(''), result.index));
});
