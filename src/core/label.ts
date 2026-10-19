import type { Parser } from './parser';

import { context, record } from './context';
import { create } from './parser';

/**
 * Replaces the expectations of a parser with a single description.
 *
 * Only applies when the parser failed without consuming input: once it has
 * consumed input, its own error further along is more useful than the label.
 * The labelled parser runs against a separate context, so the expectations of
 * the parsers inside it do not leak into the message.
 *
 * @example
 * label(char('x'), 'letter x')('') // { ok: false, index: 0, expected: ['letter x'] }
 */
export const label = <T>(parser: Parser<T>, expected: string): Parser<T> => {
    return create<T>((input, index = 0, ctx) => {
        const inner = context();
        const result = parser(input, index, inner);

        if (result.ok || result.index > index) {
            if (inner.furthest >= 0) {
                record(ctx, inner.furthest, inner.expected);
            }

            return result;
        }

        const described = [expected];
        record(ctx, index, described);

        return { ok: false, index, expected: described };
    });
};
