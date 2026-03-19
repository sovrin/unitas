import { failure } from '../core/failure';
import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { many } from './many';

/**
 * parses one or more occurrences of parser (right-to-left)
 * fails if there are no matches
 * on success, folds all items (plus the initial) with the folder
 */
export const foldRight1 = <T, U>(
    parser: Parser<T>,
    initial: U,
    folder: (acc: U, item: T) => U,
): Parser<U> => {
    return create<U>((input) => {
        const first = parser(input);
        if (!first.ok) {
            return failure();
        }

        const { value: firstValue, remaining: rest } = first;
        const { value: items, remaining: finalRest } = many(parser)(
            rest,
        ) as Success<T[]>;

        const all = [firstValue, ...items];
        const folded = all.reduceRight(folder, initial);

        return success(folded, finalRest);
    });
};
