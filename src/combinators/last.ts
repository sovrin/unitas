import { create } from '../core/create';
import type { Last, Parser } from '../types';
import { map } from './map';

export const last = <T extends readonly [unknown, ...unknown[]]>(
    parser: Parser<T>,
) => {
    return create<Last<T>>(
        map(parser, (arr) => arr[arr.length - 1] as Last<T>),
    );
};
