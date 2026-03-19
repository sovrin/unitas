import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { many } from './many';

/**
 * parses zero or more occurrences of parser (right-to-left)
 * never fails
 * on zero matches, returns the initial value
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
