import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { letter } from './letter';

const parser = many1(letter);

/**
 * Parse one or more letters.
 *
 * @example
 * letters('abc123') // { ok: true, value: 'abc', remaining: '123' }
 */
export const letters = create<string>((input) => {
    const result = parser(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
