import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { alphaNum } from './alphaNum';

/**
 * Parse one or more alphanumeric characters.
 *
 * @example
 * alphaNums('abc123') // { ok: true, value: 'abc123', remaining: '' }
 */
export const alphaNums = create<string>((input) => {
    const result = many1(alphaNum)(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
