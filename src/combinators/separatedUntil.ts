import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success, type Success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * Parse items separated by a separator, up to a terminator.
 *
 * @example
 * separatedUntil(digits, char(','), char(';'))('1,2,3;') // { ok: true, value: [1, 2, 3], index: 6 }
 */
export const separatedUntil = <T>(
    parser: Parser<T>,
    separator: Parser,
    terminator: Parser,
) => {
    return create<T[]>((input, index = 0, ctx) => {
        const items = separatedBy(parser, separator)(
            input,
            index,
            ctx,
        ) as Success<T[]>;
        const result = terminator(input, items.index, ctx);

        return result.ok ? success(items.value, result.index) : result;
    });
};
