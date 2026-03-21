import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';
import { sequence } from './sequence';

/**
 * @example
 * keep only the left result from a sequence
 * left(literal('hello'), literal('world'))('helloworld') // { ok: true, value: 'hello', remaining: '' }
 */
export const left = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => {
    return create<A>(map(sequence(parserA, parserB), ([a]) => a));
};
