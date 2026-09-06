import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse any single character.
 *
 * @example
 * anyChar('abc') // { ok: true, value: 'a', index: 1, furthest: -1, expected: [] }
 */
export const anyChar = create<string>((input, index = 0) => {
    return index < input.length
        ? success(input[index], index + 1)
        : failure(index, 'any character');
});
