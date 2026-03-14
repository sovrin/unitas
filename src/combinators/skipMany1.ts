import type { Parser } from '../types';

import { create } from '../core/create';
import { many1 } from './many1';
import { map } from './map';

/**
 * one or more
 */
export const skipMany1 = <T>(parser: Parser<T>) => {
    return create<null>(map(many1(parser), () => null));
};
