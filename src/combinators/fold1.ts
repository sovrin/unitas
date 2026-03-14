import type { Parser, Success } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
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
        if (!first) {
            return failure();
        }

        const [firstValue, rest] = first;

        let acc = folder(initial, firstValue);

        const [items, finalRest] = many(parser)(rest) as Success<T[]>;
        acc = items.reduce(folder, acc);

        return success(acc, finalRest);
    });
};
