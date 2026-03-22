import { failure } from '../core/failure';
import { create, type Parser } from '../core/parser';
import { success, type Success } from '../core/success';
import { separatedBy } from './separatedBy';

/**
 * Parse items separated by separator until terminator matches.
 *
 * @example
 * separatedUntil(char('a'), char(','), char(';'))('a,a,a;') // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
 */
export const separatedUntil = <T>(
    parser: Parser<T>,
    separator: Parser,
    terminator: Parser,
) => {
    return create<T[]>((input) => {
        const { value: values, remaining } = separatedBy(
            parser,
            separator,
        )(input) as Success<T[]>;

        const result = terminator(remaining);

        return result.ok ? success(values, result.remaining) : failure();
    });
};
