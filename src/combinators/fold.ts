import { create } from '../core/create';
import { success } from '../core/success';
import type { Parser, Success } from '../types';
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
        const [items, rest] = many(parser)(input) as Success<T[]>;

        return success(items.reduce(folder, initial), rest);
    });
};
