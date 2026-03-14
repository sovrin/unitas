import type { Parser } from '../types';

import { create } from '../core/create';
import { many } from './many';
import { map } from './map';

/**
 * zero or more
 */
export const skipMany = <T>(parser: Parser<T>) => {
    return create<null>(map(many(parser), () => null));
};
