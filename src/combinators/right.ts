import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';
import { sequence } from './sequence';

export const right = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => {
    return create<B>(map(sequence(parserA, parserB), ([, b]) => b));
};
