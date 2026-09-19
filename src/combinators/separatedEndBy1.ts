import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { success } from '../core/success';
import { separatedBy1 } from './separatedBy1';

/**
 * Parse one or more items separated by a separator, allowing a trailing one.
 *
 * @example
 * separatedEndBy1(digits, char(','))('1,2,3,') // { ok: true, value: [1, 2, 3], index: 6 }
 */
export const separatedEndBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input, index = 0, ctx) => {
        const result = separatedBy1(parser, separator)(input, index, ctx);
        if (!result.ok) {
            return result;
        }

        const sepResult = separator(input, result.index, ctx);

        return success(
            result.value,
            sepResult.ok ? sepResult.index : result.index,
        );
    });
};
