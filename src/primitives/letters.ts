import { many1 } from '../combinators/many1';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';
import { letter } from './letter';

const parser = many1(letter);

/**
 * Parse one or more letters as a string.
 *
 * @example
 * letters('placeholder') // { ok: true, value: 'placeholder', index: 11, furthest: 11, expected: ['letter'] }
 */
export const letters = create<string>((input, index = 0) => {
    const result = parser(input, index);
    if (!result.ok) {
        return result;
    }

    return merge(result, success(result.value.join(''), result.index));
});
