import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';
import { sequence } from './sequence';

/**
 * Keep only the left result from a sequence.
 *
 * @example
 * left(string('hello'), string('world'))('helloworld') // { ok: true, value: 'hello', index: 10, furthest: -1, expected: [] }
 */
export const left = <A, B>(parserA: Parser<A>, parserB: Parser<B>) => {
    return create<A>(map(sequence(parserA, parserB), ([a]) => a));
};
