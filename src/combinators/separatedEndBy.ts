import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * @example
 * zero or more items separated by and ending with a terminator
 * separatedEndBy(literal('a'), literal(';'))('a;a;a;') // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
 */
export const separatedEndBy = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy(parser, separator)(input);

        const { value: values, remaining } = result as Success<T[]>;
        const sepResult = separator(remaining);

        return success(values, sepResult.ok ? sepResult.remaining : remaining);
    });
};
