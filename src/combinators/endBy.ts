import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { many } from './many';
import { map } from './map';
import { sequence } from './sequence';

/**
 * zero or more
 */
export const endBy = <T>(parser: Parser<T>, terminator: Parser) => {
    return create<T[]>(
        many(map(sequence(parser, terminator), ([value]) => value)),
    );
};
