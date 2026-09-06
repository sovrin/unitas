import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Match the end of the input.
 *
 * @example
 * eof('') // { ok: true, value: null, index: 0, furthest: -1, expected: [] }
 */
export const eof = create<null>((input, index = 0) => {
    return index >= input.length
        ? success(null, index)
        : failure(index, 'end of input');
});
