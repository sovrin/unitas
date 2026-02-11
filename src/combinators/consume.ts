import { create } from '../core/create';
import type { Parser } from '../types';
import { map } from './map';

export const consume = <T>(parser: Parser<T>) => {
    return create<null>(map(parser, () => null));
};
