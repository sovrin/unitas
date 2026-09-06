import { many1 } from '../combinators/many1';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';
import { uppercase } from './uppercase';

const parser = many1(uppercase);

/**
 * Parse one or more uppercase letters as a string.
 *
 * @example
 * uppercases('placeholder') // { ok: false, index: 0, furthest: 0, expected: ['uppercase letter'] }
 */
export const uppercases = create<string>((input, index = 0) => {
    const result = parser(input, index);
    if (!result.ok) {
        return result;
    }

    return merge(result, success(result.value.join(''), result.index));
});
