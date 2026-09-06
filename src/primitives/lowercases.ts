import { many1 } from '../combinators/many1';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';
import { lowercase } from './lowercase';

const parser = many1(lowercase);

/**
 * Parse one or more lowercase letters as a string.
 *
 * @example
 * lowercases('placeholder') // { ok: true, value: 'placeholder', index: 11, furthest: 11, expected: ['lowercase letter'] }
 */
export const lowercases = create<string>((input, index = 0) => {
    const result = parser(input, index);
    if (!result.ok) {
        return result;
    }

    return merge(result, success(result.value.join(''), result.index));
});
