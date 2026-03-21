import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { whitespace } from '../terminals/whitespace';
import { many } from './many';
import { map } from './map';
import { sequence } from './sequence';

export const padded = <T>(content: Parser<T>) => {
    const parser = map(
        sequence(many(whitespace), content, many(whitespace)),
        ([, value]) => value,
    );

    return create<T>((input) => {
        return parser(input);
    });
};
