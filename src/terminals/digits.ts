import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { digit } from './digit';

/**
 * Parse one or more digits and return as number.
 *
 * @example
 * digits('123abc') // { ok: true, value: 123, remaining: 'abc' }
 */
export const digits = create<number>((input) => {
    const result = many1(digit)(input);
    if (!result.ok) {
        return failure();
    }

    const { value: list, remaining: rest } = result;
    const value = list.reduce((acc, d) => acc * 10 + d, 0);

    return success(value, rest);
});
