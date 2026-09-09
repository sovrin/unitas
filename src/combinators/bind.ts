import { create } from '../core/parser';
import { type Parser } from '../core/parser';

/**
 * Chain parsers where the second parser depends on the first result.
 *
 * @example
 * bind(digits, (n) => take(n))('3abc') // { ok: true, value: 'abc', index: 4 }
 */
export const bind = <A, B>(
    parser: Parser<A>,
    f: (a: A) => Parser<B>,
): Parser<B> => {
    return create<B>((input, index = 0, ctx) => {
        const result = parser(input, index, ctx);
        if (!result.ok) {
            return result;
        }

        return f(result.value)(input, result.index, ctx);
    });
};
