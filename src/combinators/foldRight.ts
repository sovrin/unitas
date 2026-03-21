import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { many } from './many';

/**
 * @example
 * parse zero or more and fold right-to-left
 * foldRight(digit, [], (acc, d) => [...acc, d])('123') // { ok: true, value: [3, 2, 1], remaining: '' }
 */
export const foldRight = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input) => {
        const { value, remaining } = many(parser)(input) as Success<T[]>;

        return success(value.reduceRight(folder, initial), remaining);
    });
};
