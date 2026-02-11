import { create } from '../core/create';
import type { Parser } from '../types';
import { map } from './map';
import { sequence } from './sequence';

export const left = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => {
    return create<A>(map(sequence(parserA, parserB), ([a]) => a));
};
