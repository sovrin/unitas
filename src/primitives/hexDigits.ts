import { many1 } from '../combinators/many1';
import { create } from '../core/parser';
import { success } from '../core/success';
import { hexDigit } from './hexDigit';

const parser = many1(hexDigit);

/**
 * Parse one or more hex digits as a string.
 *
 * @example
 * hexDigits('deadbeef') // { ok: true, value: 'deadbeef', index: 8 }
 */
export const hexDigits = create<string>((input, index = 0, ctx) => {
    const result = parser(input, index, ctx);
    if (!result.ok) {
        return result;
    }

    return success(result.value.join(''), result.index);
});
