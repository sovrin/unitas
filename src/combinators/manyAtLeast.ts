import { failure } from '../core/failure';
import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { exactly } from './exactly';
import { many } from './many';

/**
 * Parse at least n occurrences.
 *
 * @example
 * manyAtLeast(literal('a'), 2)('aaa') // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
 */
export const manyAtLeast = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input) => {
        const required = exactly(parser, n)(input);
        if (!required.ok) {
            return failure();
        }

        const { value: more, remaining: rest } = many(parser)(
            required.remaining,
        ) as Success<T[]>;

        return success([...required.value, ...more], rest);
    });
};
