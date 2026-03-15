import type { Parser, Success } from '../types';

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
        const { value: values, remaining } = separatedBy(
            parser,
            separator,
        )(input) as Success<T[]>;

        const result = terminator(remaining);
        return result.ok ? success(values, result.remaining) : failure();
    });
};
