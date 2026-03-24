import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse a specific string.
 *
 * @example
 * string('hello')('hello world') // { ok: true, value: 'hello', remaining: ' world' }
 */
export const string = <S extends string>(str: S) => {
    return create<S>((input) => {
        return input.startsWith(str)
            ? success(str, input.slice(str.length))
            : failure();
    });
};
