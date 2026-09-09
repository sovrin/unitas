import { many1 } from '../combinators/many1';
import { create } from '../core/parser';
import { success } from '../core/success';
import { whitespace } from './whitespace';

const parser = many1(whitespace);

/**
 * Parse one or more whitespaces as a string.
 *
 * @example
 * whitespaces(' \t\nabc') // { ok: true, value: ' \t\n', index: 3 }
 */
export const whitespaces = create<string>((input, index = 0, ctx) => {
    const result = parser(input, index, ctx);
    if (!result.ok) {
        return result;
    }

    return success(result.value.join(''), result.index);
});
