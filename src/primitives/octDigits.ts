import { many1 } from '../combinators/many1';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';
import { octDigit } from './octDigit';

const parser = many1(octDigit);

/**
 * Parse one or more octal digits as a string.
 *
 * @example
 * octDigits('placeholder') // { ok: false, index: 0, furthest: 0, expected: ['octal digit'] }
 */
export const octDigits = create<string>((input, index = 0) => {
    const result = parser(input, index);
    if (!result.ok) {
        return result;
    }

    return merge(result, success(result.value.join(''), result.index));
});
