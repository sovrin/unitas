import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { many } from './many';

/**
 * Parse zero or more and fold into a single value.
 *
 * @example
 * fold(digit, [], (acc, d) => [...acc, d])('123') // { ok: true, value: [1, 2, 3], remaining: '' }
 */
export const fold = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input) => {
        const result = many(parser)(input) as Success<T[]>;
        const { value, remaining } = result;

        return success(value.reduce(folder, initial), remaining);
    });
};
