import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { uppercase } from './uppercase';

/**
 * Parses one or more uppercase letters.
 *
 * @example
 * uppercases('ABCdef') // { ok: true, value: 'ABC', remaining: 'def' }
 */
export const uppercases = create<string>((input) => {
    const result = many1(uppercase)(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
