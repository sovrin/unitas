import { create } from '../core/create';
import type { Parser } from '../types';
import { map } from './map';
import { sequence } from './sequence';

export const middle = <A, B, C>(
    parserA: Parser<A>,
    parserB: Parser<B>,
    parserC: Parser<C>,
) => {
    return create<B>(map(sequence(parserA, parserB, parserC), ([, b]) => b));
};
