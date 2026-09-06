import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success, type Success } from '../core/success';
import { many } from './many';

/**
 * Fold one or more occurrences from the right into a single value.
 *
 * @example
 * foldRight1(digit, 0, (acc, d) => acc + d)('123') // { ok: true, value: 6, index: 3, furthest: 3, expected: ['digit'] }
 */
export const foldRight1 = <T, U>(
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
        const all = [first.value, ...rest.value];

        return merge(
            first,
            merge(rest, success(all.reduceRight(folder, initial), rest.index)),
        );
    });
};
