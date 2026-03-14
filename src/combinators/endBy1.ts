import type { Parser } from '../types';

import { create } from '../core/create';
import { many1 } from './many1';
import { map } from './map';
import { sequence } from './sequence';

/**
 * one or more
 */
export const endBy1 = <T>(parser: Parser<T>, terminator: Parser) => {
    return create<T[]>(
        many1(map(sequence(parser, terminator), ([value]) => value)),
    );
};
