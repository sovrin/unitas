import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';
import { sequence } from './sequence';

export const left = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => {
    return create<A>(map(sequence(parserA, parserB), ([a]) => a));
};
