import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { hexDigit } from './hexDigit';

/**
 * Parse one or more hexadecimal digits.
 *
 * @example
 * hexDigits('deadbeef') // { ok: true, value: 'deadbeef', remaining: '' }
 */
export const hexDigits = create<string>((input) => {
    const result = many1(hexDigit)(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
