import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Takes characters while the predicate returns true.
 *
 * @example
 * takeWhile((c) => c !== 'x')('abcx') // { ok: true, value: 'abc', index: 3, furthest: -1, expected: [] }
 */
export const takeWhile = (predicate: (char: string) => boolean) => {
    return create<string>((input, index = 0) => {
        let end = index;
        while (end < input.length && predicate(input[end])) {
            end++;
        }

        return success(input.slice(index, end), end);
    });
};
