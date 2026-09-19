import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Match the end of the input.
 *
 * @example
 * eof('') // { ok: true, value: null, index: 0 }
 */
export const eof = create<null>((input, index = 0, ctx) => {
    return index >= input.length
        ? success(null, index)
        : failure(ctx, index, 'end of input');
});
