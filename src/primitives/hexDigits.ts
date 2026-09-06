import { many1 } from '../combinators/many1';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';
import { hexDigit } from './hexDigit';

const parser = many1(hexDigit);

/**
 * Parse one or more hex digits as a string.
 *
 * @example
 * hexDigits('placeholder') // { ok: false, index: 0, furthest: 0, expected: ['hex digit'] }
 */
export const hexDigits = create<string>((input, index = 0) => {
    const result = parser(input, index);
    if (!result.ok) {
        return result;
    }

    return merge(result, success(result.value.join(''), result.index));
});
