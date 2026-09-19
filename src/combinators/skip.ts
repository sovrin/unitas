import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Result } from '../core/result';
import { success } from '../core/success';

/**
 * Skip a parser n times.
 *
 * @example
 * skip(char('a'), 2)('aabc') // { ok: true, value: null, index: 2 }
 */
export const skip = <T>(parser: Parser<T>, count: number) => {
    return create<null>((input, index = 0, ctx) => {
        let at = index;

        for (let i = 0; i < count; i++) {
            const result: Result<T> = parser(input, at, ctx);
            if (!result.ok) {
                return result;
            }

            at = result.index;
        }

        return success(null, at);
    });
};
