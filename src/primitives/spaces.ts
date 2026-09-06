import { many1 } from '../combinators/many1';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success } from '../core/success';
import { space } from './space';

const parser = many1(space);

/**
 * Parse one or more spaces as a string.
 *
 * @example
 * spaces('placeholder') // { ok: false, index: 0, furthest: 0, expected: ['space'] }
 */
export const spaces = create<string>((input, index = 0) => {
    const result = parser(input, index);
    if (!result.ok) {
        return result;
    }

    return merge(result, success(result.value.join(''), result.index));
});
