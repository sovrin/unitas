import { reject } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Take n characters.
 *
 * @example
 * take(3)('abcdef') // { ok: true, value: 'abc', index: 3 }
 */
export const take = (count: number) => {
    const described = [`${count} more character${count === 1 ? '' : 's'}`];

    return create<string>((input, index = 0, ctx) =>
        input.length - index >= count
            ? success(input.slice(index, index + count), index + count)
            : reject(ctx, index, described),
    );
};
