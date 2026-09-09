import { many1 } from '../combinators/many1';
import { create } from '../core/parser';
import { success } from '../core/success';
import { octDigit } from './octDigit';

const parser = many1(octDigit);

/**
 * Parse one or more octal digits as a string.
 *
 * @example
 * octDigits('755rest') // { ok: true, value: '755', index: 3 }
 */
export const octDigits = create<string>((input, index = 0, ctx) => {
    const result = parser(input, index, ctx);
    if (!result.ok) {
        return result;
    }

    return success(result.value.join(''), result.index);
});
