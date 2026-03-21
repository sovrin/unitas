import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { lowercase } from './lowercase';

/**
 * Parses one or more lowercase letters.
 *
 * @example
 * lowercases('abcDEF') // { ok: true, value: 'abc', remaining: 'DEF' }
 */
export const lowercases = create<string>((input) => {
    const result = many1(lowercase)(input);
    if (!result.ok) {
        return failure();
    }

    const { value, remaining } = result;

    return success(value.join(''), remaining);
});
