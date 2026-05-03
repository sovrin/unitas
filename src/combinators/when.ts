import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';

/**
 * Branch on a boolean parser result.
 *
 * @example
 * when(flag(char('*')), pure('many'), pure('one'))('*rest') // { ok: true, value: 'many', remaining: 'rest' }
 * when(flag(char('*')), pure('many'), pure('one'))('abc') // { ok: true, value: 'one', remaining: 'abc' }
 */
export const when = <T>(
    condition: Parser<boolean>,
    thenParser: Parser<T>,
    elseParser: Parser<T>,
): Parser<T> => {
    return create<T>((input) => {
        const result = condition(input);

        if (!result.ok) {
            return failure();
        }

        return result.value
            ? thenParser(result.remaining)
            : elseParser(result.remaining);
    });
};
