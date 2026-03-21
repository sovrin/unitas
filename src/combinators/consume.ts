import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';

/**
 * Consume input but discard the result (return null).
 *
 * @example
 * consume(literal('hello'))('hello world') // { ok: true, value: null, remaining: ' world' }
 */
export const consume = <T>(parser: Parser<T>) => {
    return create<null>(map(parser, () => null));
};
