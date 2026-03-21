import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { many } from './many';
import { map } from './map';
import { sequence } from './sequence';

/**
 * @example
 * zero or more items separated and ending with terminator
 * endBy(literal('item'), literal(';'))('item;item;item;') // { ok: true, value: ['item', 'item', 'item'], remaining: '' }
 */
export const endBy = <T>(parser: Parser<T>, terminator: Parser) => {
    return create<T[]>(
        many(map(sequence(parser, terminator), ([value]) => value)),
    );
};
