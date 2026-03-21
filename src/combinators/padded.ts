import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { whitespace } from '../terminals/whitespace';
import { many } from './many';
import { map } from './map';
import { sequence } from './sequence';

/**
 * @example
 * parse content with optional whitespace on both sides
 * padded(literal('hi'))('   hi   ') // { ok: true, value: 'hi', remaining: '' }
 */
export const padded = <T>(content: Parser<T>) => {
    const parser = map(
        sequence(many(whitespace), content, many(whitespace)),
        ([, value]) => value,
    );

    return create<T>((input) => {
        return parser(input);
    });
};
