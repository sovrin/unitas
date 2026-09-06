import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse a specific string.
 *
 * @example
 * string('hello')('hello world') // { ok: true, value: 'hello', index: 5, furthest: -1, expected: [] }
 */
export const string = <S extends string>(str: S) => {
    const described = `'${str}'`;
    const { length } = str;

    return create<S>((input, index = 0) => {
        return input.startsWith(str, index)
            ? success(str, index + length)
            : failure(index, described);
    });
};
