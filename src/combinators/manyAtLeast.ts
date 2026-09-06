import type { Parser } from '../core/parser';

import { merge } from '../core/merge';
import { create } from '../core/parser';
import { type Success } from '../core/success';
import { exactly } from './exactly';
import { many } from './many';

/**
 * Parse at least n occurrences.
 *
 * @example
 * manyAtLeast(char('a'), 2)('aaa') // { ok: true, value: ['a', 'a', 'a'], index: 3, furthest: 3, expected: ["'a'"] }
 */
export const manyAtLeast = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input, index = 0) => {
        const required = exactly(parser, n)(input, index);
        if (!required.ok) {
            return required;
        }

        const rest = many(parser)(input, required.index) as Success<T[]>;

        return merge(required, {
            ...rest,
            value: [...required.value, ...rest.value],
        });
    });
};
