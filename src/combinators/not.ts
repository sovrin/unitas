import type { Parser } from '../core/parser';

import { context } from '../core/context';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Succeed if parser fails (without consuming input).
 *
 * The inner parser runs against an isolated context: its failure is the
 * expected outcome here, so reporting it would produce a misleading
 * expectation in the final message.
 *
 * @example
 * not(string('hello'))('world') // { ok: true, value: null, index: 0 }
 */
export const not = <T>(parser: Parser<T>) => {
    return create<null>((input, index = 0, ctx) => {
        const result = parser(input, index, context());

        return result.ok ? failure(ctx, index) : success(null, index);
    });
};
