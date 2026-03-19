import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';

export type First<T extends readonly unknown[]> = T extends readonly [
    infer F,
    ...unknown[],
]
    ? F
    : never;

export const first = <T extends readonly unknown[]>(
    parser: Parser<T>,
): Parser<First<T>> => {
    return create<First<T>>(map(parser, (arr) => arr[0] as First<T>));
};
