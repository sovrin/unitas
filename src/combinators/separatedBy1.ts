import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * Parse one or more items separated by a separator.
 *
 * @example
 * separatedBy1(digits, char(','))('1,2,3') // { ok: true, value: [1, 2, 3], index: 5, furthest: 5, expected: ["','"] }
 */
export const separatedBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input, index = 0) => {
        const result = separatedBy(parser, separator)(
            input,
            index,
        ) as Success<T[]>;

        if (result.value.length === 0) {
            return merge(result, failure(index));
        }

        return result;
    });
};
