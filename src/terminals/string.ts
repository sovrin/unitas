import { reject } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse a specific string.
 *
 * @example
 * string('hello')('hello world') // { ok: true, value: 'hello', index: 5 }
 */
export const string = <S extends string>(str: S) => {
    const described = [`'${str}'`];
    const { length } = str;

    return create<S>((input, index = 0, ctx) => {
        return input.startsWith(str, index)
            ? success(str, index + length)
            : reject(ctx, index, described);
    });
};
