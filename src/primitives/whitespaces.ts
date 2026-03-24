import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { whitespace } from './whitespace';

const parser = many1(whitespace);

/**
 * Parses one or more whitespace characters.
 *
 * @example
 * whitespaces('  abc') // { ok: true, value: '  ', remaining: 'abc' }
 */
export const whitespaces = create<string>((input) => {
    const result = parser(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
