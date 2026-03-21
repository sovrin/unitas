import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse any single character.
 *
 * @example
 * anyChar('abc') // { ok: true, value: 'a', remaining: 'bc' }
 */
export const anyChar = create<string>((input) => {
    return input.length > 0 ? success(input[0], input.slice(1)) : failure();
});
