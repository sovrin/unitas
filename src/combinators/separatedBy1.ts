import { failure } from '../core/failure';
import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * One or more items separated by a separator.
 *
 * @example
 * separatedBy1(literal('a'), literal(','))('a,a,a') // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
 */
export const separatedBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy(parser, separator)(input);

        const { value: values, remaining } = result as Success<T[]>;
        if (values.length === 0) return failure();

        return success(values, remaining);
    });
};
