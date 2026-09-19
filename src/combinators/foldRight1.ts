import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success, type Success } from '../core/success';
import { many } from './many';

/**
 * Fold one or more occurrences from the right into a single value.
 *
 * @example
 * foldRight1(digit, 0, (acc, d) => acc + d)('123') // { ok: true, value: 6, index: 3 }
 */
export const foldRight1 = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input, index = 0, ctx) => {
        const first = parser(input, index, ctx);
        if (!first.ok) {
            return first;
        }

        const rest = many(parser)(input, first.index, ctx) as Success<T[]>;
        const all = [first.value, ...rest.value];

        return success(all.reduceRight(folder, initial), rest.index);
    });
};
