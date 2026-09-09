import { many1 } from '../combinators/many1';
import { create } from '../core/parser';
import { success } from '../core/success';
import { alphaNum } from './alphaNum';

const parser = many1(alphaNum);

/**
 * Parse one or more alphanumeric characters as a string.
 *
 * @example
 * alphaNums('placeholder') // { ok: true, value: 'placeholder', index: 11 }
 */
export const alphaNums = create<string>((input, index = 0, ctx) => {
    const result = parser(input, index, ctx);
    if (!result.ok) {
        return result;
    }

    return success(result.value.join(''), result.index);
});
