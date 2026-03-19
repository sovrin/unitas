import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { many } from './many';

/**
 * parses zero or more occurrences of parser (left-to-right)
 * never fails
 * on zero matches, returns the initial value
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
