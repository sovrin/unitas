import { many1 } from '../combinators/many1';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';
import { alphaNum } from './alphaNum';

const parser = many1(alphaNum);

/**
 * Parse one or more alphanumeric characters as a string.
 *
 * @example
 * alphaNums('placeholder') // { ok: true, value: 'placeholder', index: 11, furthest: 11, expected: ['alphanumeric character'] }
 */
export const alphaNums = create<string>((input, index = 0) => {
    const result = parser(input, index);
    if (!result.ok) {
        return result;
    }

    return merge(result, success(result.value.join(''), result.index));
});
