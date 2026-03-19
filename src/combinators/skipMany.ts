import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { many } from './many';
import { map } from './map';

/**
 * zero or more
 */
export const skipMany = <T>(parser: Parser<T>) => {
    return create<null>(map(many(parser), () => null));
};
