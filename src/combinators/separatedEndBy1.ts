import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { separatedBy1 } from './separatedBy1';

/**
 * @example
 * one or more items separated by and ending with a terminator
 * separatedEndBy1(literal('a'), literal(';'))('a;a;a;') // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
 */
export const separatedEndBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy1(parser, separator)(input);
        if (!result.ok) return failure();

        const { value: values, remaining } = result;
        const sepResult = separator(remaining);

        return success(values, sepResult.ok ? sepResult.remaining : remaining);
    });
};
