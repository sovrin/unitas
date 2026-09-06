import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Take n characters.
 *
 * @example
 * take(3)('abcdef') // { ok: true, value: 'abc', index: 3, furthest: -1, expected: [] }
 */
export const take = (count: number) => {
    const described = `${count} more character${count === 1 ? '' : 's'}`;

    return create<string>((input, index = 0) =>
        input.length - index >= count
            ? success(input.slice(index, index + count), index + count)
            : failure(index, described),
    );
};
