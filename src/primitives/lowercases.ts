import { many1 } from '../combinators/many1';
import { create } from '../core/parser';
import { success } from '../core/success';
import { lowercase } from './lowercase';

const parser = many1(lowercase);

/**
 * Parse one or more lowercase letters as a string.
 *
 * @example
 * lowercases('placeholder') // { ok: true, value: 'placeholder', index: 11 }
 */
export const lowercases = create<string>((input, index = 0, ctx) => {
    const result = parser(input, index, ctx);
    if (!result.ok) {
        return result;
    }

    return success(result.value.join(''), result.index);
});
