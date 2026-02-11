import { create } from '../core/create';
import type { Nth, Parser } from '../types';
import { map } from './map';

export const nth = <T extends readonly unknown[], N extends number>(
    parser: Parser<T>,
    index: N,
): Parser<Nth<T, N>> => {
    return create<Nth<T, N>>(map(parser, (arr) => arr[index] as Nth<T, N>));
};
