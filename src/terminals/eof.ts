import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse end of file (succeeds only on empty input).
 *
 * @example
 * eof('') // { ok: true, value: null, remaining: '' }
 */
export const eof = create<null>((input) => {
    return input.length === 0 ? success(null, input) : failure();
});
