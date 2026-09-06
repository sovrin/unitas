import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success, type Success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * Parse items separated by a separator, up to a terminator.
 *
 * @example
 * separatedUntil(digits, char(','), char(';'))('1,2,3;') // { ok: true, value: [1, 2, 3], index: 6, furthest: 5, expected: ["','"] }
 */
export const separatedUntil = <T>(
    parser: Parser<T>,
    separator: Parser,
    terminator: Parser,
) => {
    return create<T[]>((input, index = 0) => {
        const items = separatedBy(parser, separator)(
            input,
            index,
        ) as Success<T[]>;
        const result = merge(items, terminator(input, items.index));

        return result.ok
            ? merge(result, success(items.value, result.index))
            : result;
    });
};
