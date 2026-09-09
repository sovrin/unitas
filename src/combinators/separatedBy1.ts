import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { type Success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * Parse one or more items separated by a separator.
 *
 * @example
 * separatedBy1(digits, char(','))('1,2,3') // { ok: true, value: [1, 2, 3], index: 5 }
 */
export const separatedBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input, index = 0, ctx) => {
        const result = separatedBy(parser, separator)(
            input,
            index,
            ctx,
        ) as Success<T[]>;

        if (result.value.length === 0) {
            return failure(ctx, index);
        }

        return result;
    });
};
