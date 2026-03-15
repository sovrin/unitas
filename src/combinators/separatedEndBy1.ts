import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { separatedBy1 } from './separatedBy1';

/**
 * one or more
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
