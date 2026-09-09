import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { type Success } from '../core/success';
import { exactly } from './exactly';
import { manyAtMost } from './manyAtMost';

/**
 * Parse between min and max occurrences.
 *
 * @example
 * manyBetween(char('a'), 1, 2)('aaa') // { ok: true, value: ['a', 'a'], index: 2 }
 */
export const manyBetween = <T>(parser: Parser<T>, min: number, max: number) => {
    return create<T[]>((input, index = 0, ctx) => {
        const required = exactly(parser, min)(input, index, ctx);
        if (!required.ok) {
            return required;
        }

        const rest = manyAtMost(parser, max - min)(
            input,
            required.index,
            ctx,
        ) as Success<T[]>;

        return {
            ...rest,
            value: [...required.value, ...rest.value],
        };
    });
};
