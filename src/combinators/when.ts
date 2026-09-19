import type { Parser } from '../core/parser';

import { create } from '../core/parser';

/**
 * Branch on a boolean parser result.
 *
 * @example
 * when(flag(char('*')), pure('many'), pure('one'))('*rest') // { ok: true, value: 'many', index: 1 }
 * when(flag(char('*')), pure('many'), pure('one'))('abc') // { ok: true, value: 'one', index: 0 }
 */
export const when = <T>(
    condition: Parser<boolean>,
    thenParser: Parser<T>,
    elseParser: Parser<T>,
): Parser<T> => {
    return create<T>((input, index = 0, ctx) => {
        const result = condition(input, index, ctx);

        if (!result.ok) {
            return result;
        }

        const branch = result.value ? thenParser : elseParser;

        return branch(input, result.index, ctx);
    });
};
