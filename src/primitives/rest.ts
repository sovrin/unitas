import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Consume and return everything left in the input.
 *
 * @example
 * rest('abc') // { ok: true, value: 'abc', index: 3, furthest: -1, expected: [] }
 */
export const rest = create<string>((input, index = 0) =>
    success(input.slice(index), input.length),
);
