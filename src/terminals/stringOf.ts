import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse first character that exists in string (like charOf but for a string).
 *
 * @example
 * stringOf('abc')('abcdef') // { ok: true, value: 'a', index: 1, furthest: -1, expected: [] }
 */
export const stringOf = (chars: string) => {
    const described = `one of '${chars}'`;

    return create<string>((input, index = 0) =>
        index < input.length && chars.includes(input[index])
            ? success(input[index], index + 1)
            : failure(index, described),
    );
};
