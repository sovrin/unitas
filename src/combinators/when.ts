import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';

/**
 * Branch on a boolean parser result.
 *
 * @example
 * when(flag(char('*')), pure('many'), pure('one'))('*rest') // { ok: true, value: 'many', index: 1, furthest: -1, expected: [] }
 * when(flag(char('*')), pure('many'), pure('one'))('abc') // { ok: true, value: 'one', index: 0, furthest: 0, expected: ["'*'"] }
 */
export const when = <T>(
    condition: Parser<boolean>,
    thenParser: Parser<T>,
    elseParser: Parser<T>,
): Parser<T> => {
    return create<T>((input, index = 0) => {
        const result = condition(input, index);

        if (!result.ok) {
            return result;
        }

        const branch = result.value ? thenParser : elseParser;

        return merge(result, branch(input, result.index));
    });
};
