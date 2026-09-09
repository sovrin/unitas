import { create, type Parser } from '../core/parser';
import { type Success } from '../core/success';
import { many } from './many';

/**
 * One or more occurrences.
 *
 * @example
 * many1(char('a'))('aaa') // { ok: true, value: ['a', 'a', 'a'], index: 3 }
 */
export const many1 = <T>(parser: Parser<T>) => {
    return create<T[]>((input, index = 0, ctx) => {
        const result = parser(input, index, ctx);
        if (!result.ok) {
            return result;
        }

        const rest = many(parser)(input, result.index, ctx) as Success<T[]>;

        return {
            ...rest,
            value: [result.value, ...rest.value],
        };
    });
};
