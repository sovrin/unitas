import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success, type Success } from '../core/success';
import { many } from './many';

/**
 * Fold one or more occurrences into a single value.
 *
 * @example
 * fold1(digit, 0, (acc, d) => acc + d)('123') // { ok: true, value: 6, index: 3, furthest: 3, expected: ['digit'] }
 */
export const fold1 = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input, index = 0) => {
        const first = parser(input, index);
        if (!first.ok) {
            return first;
        }

        const rest = many(parser)(input, first.index) as Success<T[]>;
        const acc = rest.value.reduce(folder, folder(initial, first.value));

        return merge(first, merge(rest, success(acc, rest.index)));
    });
};
