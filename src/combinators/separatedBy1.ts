import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import type { Parser } from '../types';
import { separatedBy } from './separatedBy';

/**
 * one or more
 */
export const separatedBy1 = <T>(parser: Parser<T>, separator: Parser) => {
    return create<T[]>((input) => {
        const result = separatedBy(parser, separator)(input);

        const [values, remaining] = result!;
        if (values.length === 0) return failure();

        return success(values, remaining);
    });
};
