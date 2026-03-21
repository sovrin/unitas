import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { many } from './many';
import { map } from './map';

/**
 * @example
 * skip zero or more occurrences (never fails, returns null)
 * skipMany(literal('a'))('aaabc') // { ok: true, value: null, remaining: 'bc' }
 */
export const skipMany = <T>(parser: Parser<T>) => {
    return create<null>(map(many(parser), () => null));
};
