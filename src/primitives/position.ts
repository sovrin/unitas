import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Get the current offset into the input, without consuming anything.
 *
 * Counts forward from the start of the input, so it can be paired with
 * {@link locate} to attach line/column information to a parsed node.
 *
 * @example
 * position('abc') // { ok: true, value: 0, index: 0, furthest: -1, expected: [] }
 * right(string('ab'), position)('abc') // { ok: true, value: 2, index: 2, furthest: -1, expected: [] }
 */
export const position = create<number>((_input, index = 0) =>
    success(index, index),
);
