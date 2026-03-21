import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';
import { sequence } from './sequence';

export const outer = <A, B, C>(
    parserA: Parser<A>,
    parserB: Parser<B>,
    parserC: Parser<C>,
) => {
    return create<[A, C]>(
        map(sequence(parserA, parserB, parserC), ([a, , c]) => [a, c]),
    );
};
