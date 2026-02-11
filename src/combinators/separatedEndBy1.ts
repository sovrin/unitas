import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import type { Parser } from '../types';
import { separatedBy1 } from './separatedBy1';

/**
 * one or more
 */
export const separatedEndBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy1(parser, separator)(input);
        if (!result) return failure();

        const [values, remaining] = result;
        const sepResult = separator(remaining);

        return success(values, sepResult ? sepResult[1] : remaining);
    });
};
