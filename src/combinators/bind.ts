import { failure } from '../core/failure';
import { create } from '../core/parser';
import { type Parser } from '../core/parser';

/**
 * Chain parsers where the second parser depends on the first result.
 *
 * @example
 * bind(digits, (n) => take(n))('3abc') // { ok: true, value: 'abc', remaining: '' }
 */
export const bind = <A, B>(
    parser: Parser<A>,
    f: (a: A) => Parser<B>,
): Parser<B> => {
    return create<B>((input) => {
        const result = parser(input);
        if (!result.ok) {
            return failure();
        }

        const { value, remaining } = result;

        return f(value)(remaining);
    });
};
