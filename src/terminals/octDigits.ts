import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { octDigit } from './octDigit';

/**
 * Parse one or more octal digits.
 *
 * @example
 * octDigits('0777abc') // { ok: true, value: '0777', remaining: 'abc' }
 */
export const octDigits = create<string>((input) => {
    const result = many1(octDigit)(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
