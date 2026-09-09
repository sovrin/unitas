import { many1 } from '../combinators/many1';
import { create } from '../core/parser';
import { success } from '../core/success';
import { space } from './space';

const parser = many1(space);

/**
 * Parse one or more spaces as a string.
 *
 * @example
 * spaces('   abc') // { ok: true, value: '   ', index: 3 }
 */
export const spaces = create<string>((input, index = 0, ctx) => {
    const result = parser(input, index, ctx);
    if (!result.ok) {
        return result;
    }

    return success(result.value.join(''), result.index);
});
