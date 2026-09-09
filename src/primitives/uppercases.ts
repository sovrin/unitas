import { many1 } from '../combinators/many1';
import { create } from '../core/parser';
import { success } from '../core/success';
import { uppercase } from './uppercase';

const parser = many1(uppercase);

/**
 * Parse one or more uppercase letters as a string.
 *
 * @example
 * uppercases('ABCdef') // { ok: true, value: 'ABC', index: 3 }
 */
export const uppercases = create<string>((input, index = 0, ctx) => {
    const result = parser(input, index, ctx);
    if (!result.ok) {
        return result;
    }

    return success(result.value.join(''), result.index);
});
