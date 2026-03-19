import { failure } from '../core/failure';
import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { many } from './many';

/**
 * parses one or more occurrences of parser (left-to-right)
 * fails if there are no matches
 * on success, folds all items (plus the initial) with the folder
 */
export const fold1 = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input) => {
        const first = parser(input);
        if (!first.ok) {
            return failure();
        }

        const { value: firstValue, remaining } = first;

        let acc = folder(initial, firstValue);

        const { value: items, remaining: finalRest } = many(parser)(
            remaining,
        ) as Success<T[]>;

        acc = items.reduce(folder, acc);

        return success(acc, finalRest);
    });
};
