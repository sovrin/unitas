import { many1 } from '../combinators/many1';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';
import { digit } from './digit';

const parser = many1(digit);

/**
 * Parse one or more digits and return as a number.
 *
 * @example
 * digits('123') // { ok: true, value: 123, index: 3, furthest: -1, expected: [] }
 */
export const digits = create<number>((input, index = 0) => {
    const result = parser(input, index);
    if (!result.ok) {
        return result;
    }

    const value = result.value.reduce((acc, d) => acc * 10 + d, 0);

    return merge(result, success(value, result.index));
});
