import { failure } from '../core/failure';
import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { many } from './many';

/**
 * One or more occurrences (fails if no matches).
 *
 * @example
 * many1(char('a'))('aaa') // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
 */
export const many1 = <T>(parser: Parser<T>) => {
    return create<T[]>((input) => {
        const result = parser(input);
        if (!result.ok) {
            return failure();
        }

        const { value: manyValue, remaining: manyRemainder } = many(parser)(
            result.remaining,
        ) as Success<T[]>;

        return success([result.value, ...manyValue], manyRemainder);
    });
};
