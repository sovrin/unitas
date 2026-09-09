import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse any single character.
 *
 * @example
 * anyChar('abc') // { ok: true, value: 'a', index: 1 }
 */
export const anyChar = create<string>((input, index = 0, ctx) => {
    return index < input.length
        ? success(input[index], index + 1)
        : failure(ctx, index, 'any character');
});
