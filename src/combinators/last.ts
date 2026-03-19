import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';

export type Last<T extends readonly unknown[]> = T extends readonly [
    ...unknown[],
    infer L,
]
    ? L
    : never;

export const last = <T extends readonly [unknown, ...unknown[]]>(
    parser: Parser<T>,
) => {
    return create<Last<T>>(
        map(parser, (arr) => arr[arr.length - 1] as Last<T>),
    );
};
