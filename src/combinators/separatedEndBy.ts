import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { success, type Success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * Parse zero or more items separated by a separator, allowing a trailing one.
 *
 * @example
 * separatedEndBy(digits, char(','))('1,2,3,') // { ok: true, value: [1, 2, 3], index: 6, furthest: 6, expected: ['digit'] }
 */
export const separatedEndBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input, index = 0) => {
        const result = separatedBy(parser, separator)(
            input,
            index,
        ) as Success<T[]>;
        const sepResult = merge(result, separator(input, result.index));

        return merge(
            sepResult,
            success(result.value, sepResult.ok ? sepResult.index : result.index),
        );
    });
};
