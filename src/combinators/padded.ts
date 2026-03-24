import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { whitespace } from '../primitives/whitespace';
import { many } from './many';
import { map } from './map';
import { sequence } from './sequence';

/**
 * Parse content with optional whitespace on both sides.
 *
 * @example
 * padded(string('hi'))('   hi   ') // { ok: true, value: 'hi', remaining: '' }
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
