import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { map } from './map';

/**
 * @example
 * consume input but discard the result (return null)
 * consume(literal('hello'))('hello world') // { ok: true, value: null, remaining: ' world' }
 */
export const consume = <T>(parser: Parser<T>) => {
    return create<null>(map(parser, () => null));
};
