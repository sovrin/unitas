import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { separatedBy } from './separatedBy';

export const separatedUntil = <T>(
    parser: Parser<T>,
    separator: Parser,
    terminator: Parser,
) => {
    return create<T[]>((input) => {
        const [values, remaining] = separatedBy(parser, separator)(input)!;

        const result = terminator(remaining);
        return result ? success(values, result[1]) : failure();
    });
};
