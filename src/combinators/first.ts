import { create } from '../core/create';
import type { First, Parser } from '../types';
import { map } from './map';

export const first = <T extends readonly unknown[]>(
    parser: Parser<T>,
): Parser<First<T>> => {
    return create<First<T>>(map(parser, (arr) => arr[0] as First<T>));
};
