import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { many } from './many';
import { map } from './map';
import { sequence } from './sequence';

/**
 * Zero or more items separated and ending with terminator.
 *
 * @example
 * endBy(string('item'), char(';'))('item;item;item;') // { ok: true, value: ['item', 'item', 'item'], index: 15, furthest: 15, expected: ["'item'"] }
 */
export const endBy = <T>(parser: Parser<T>, terminator: Parser) => {
    return create<T[]>(
        many(map(sequence(parser, terminator), ([value]) => value)),
    );
};
