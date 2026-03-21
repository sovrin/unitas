import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Take n characters.
 *
 * @example
 * take(3)('abcdef') // { ok: true, value: 'abc', remaining: 'def' }
 */
export const take = (count: number) => {
    return create<string>((input) =>
        input.length >= count
            ? success(input.slice(0, count), input.slice(count))
            : failure(),
    );
};
