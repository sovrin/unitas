import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';
import { sequence } from './sequence';

/**
 * @example
 * keep only the right result from a sequence
 * right(literal('hello'), literal('world'))('helloworld') // { ok: true, value: 'world', remaining: '' }
 */
export const right = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => {
    return create<B>(map(sequence(parserA, parserB), ([, b]) => b));
};
