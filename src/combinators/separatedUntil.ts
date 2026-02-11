import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import type { Parser } from '../types';
import { separatedBy } from './separatedBy';

export const separatedUntil = <T>(
    parser: Parser<T>,
    separator: Parser,
    terminator: Parser,
) => {
    return create<T[]>((input) => {
        const items = separatedBy(parser, separator)(input);
        if (!items) return failure();

        const term = terminator(items[1]);
        return term ? success(items[0], term[1]) : failure();
    });
};
