import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { many } from './many';
import { map } from './map';

/**
 * Skip zero or more occurrences (never fails, returns null).
 *
 * @example
 * skipMany(char('a'))('aaabc') // { ok: true, value: null, index: 3, furthest: 3, expected: ["'a'"] }
 */
export const skipMany = <T>(parser: Parser<T>) => {
    return create<null>(map(many(parser), () => null));
};
