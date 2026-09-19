import { many1 } from '../combinators/many1';
import { create } from '../core/parser';
import { success } from '../core/success';
import { letter } from './letter';

const parser = many1(letter);

/**
 * Parse one or more letters as a string.
 *
 * @example
 * letters('placeholder') // { ok: true, value: 'placeholder', index: 11 }
 */
export const letters = create<string>((input, index = 0, ctx) => {
    const result = parser(input, index, ctx);
    if (!result.ok) {
        return result;
    }

    return success(result.value.join(''), result.index);
});
