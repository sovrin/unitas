import type { Parser } from '../types';

import { create } from '../core/create';
import { map } from './map';
import { sequence } from './sequence';

export const right = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => {
    return create<B>(map(sequence(parserA, parserB), ([, b]) => b));
};
