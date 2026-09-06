import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Skip a parser n times.
 *
 * @example
 * skip(char('a'), 2)('aabc') // { ok: true, value: null, index: 2, furthest: -1, expected: [] }
 */
export const skip = <T>(parser: Parser<T>, count: number) => {
    return create<null>((input, index = 0) => {
        let at = index;
        let trace: Result<unknown> = success(null, index);

        for (let i = 0; i < count; i++) {
            const result: Result<T> = merge(trace, parser(input, at));
            trace = result;

            if (!result.ok) {
                return result;
            }

            at = result.index;
        }

        return merge(trace, success(null, at));
    });
};
