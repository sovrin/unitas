import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success, type Success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * Parse zero or more items separated by a separator, allowing a trailing one.
 *
 * @example
 * separatedEndBy(digits, char(','))('1,2,3,') // { ok: true, value: [1, 2, 3], index: 6 }
 */
export const separatedEndBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input, index = 0, ctx) => {
        const result = separatedBy(parser, separator)(
            input,
            index,
            ctx,
        ) as Success<T[]>;
        const sepResult = separator(input, result.index, ctx);

        return success(
            result.value,
            sepResult.ok ? sepResult.index : result.index,
        );
    });
};
