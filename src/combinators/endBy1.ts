import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { many1 } from './many1';
import { map } from './map';
import { sequence } from './sequence';

/**
 * One or more items separated and ending with terminator.
 *
 * @example
 * endBy1(string('item'), char(';'))('item;item;item;') // { ok: true, value: ['item', 'item', 'item'], remaining: '' }
 */
export const endBy1 = <T>(parser: Parser<T>, terminator: Parser) => {
    return create<T[]>(
        many1(map(sequence(parser, terminator), ([value]) => value)),
    );
};
