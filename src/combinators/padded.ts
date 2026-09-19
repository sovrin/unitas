import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { whitespace } from '../primitives/whitespace';
import { many } from './many';
import { map } from './map';
import { sequence } from './sequence';

/**
 * Parse content surrounded by optional whitespace.
 *
 * @example
 * padded(string('hi'))('  hi  ') // { ok: true, value: 'hi', index: 6 }
 */
export const padded = <T>(content: Parser<T>) => {
    const parser = map(
        sequence(many(whitespace), content, many(whitespace)),
        ([, value]) => value,
    );

    return create<T>((input, index = 0, ctx) => {
        return parser(input, index, ctx);
    });
};
