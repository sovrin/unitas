import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success, type Success } from '../core/success';
import { many } from './many';

/**
 * Fold zero or more occurrences from the right into a single value.
 *
 * @example
 * foldRight(digit, 0, (acc, d) => acc + d)('123') // { ok: true, value: 6, index: 3, furthest: 3, expected: ['digit'] }
 */
export const foldRight = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input, index = 0) => {
        const result = many(parser)(input, index) as Success<T[]>;

        return merge(
            result,
            success(result.value.reduceRight(folder, initial), result.index),
        );
    });
};
