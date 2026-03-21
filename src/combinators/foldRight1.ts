import { failure } from '../core/failure';
import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { many } from './many';

/**
 * Parse one or more and fold right-to-left.
 *
 * @example
 * foldRight1(digit, [], (acc, d) => [...acc, d])('123') // { ok: true, value: [3, 2, 1], remaining: '' }
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
