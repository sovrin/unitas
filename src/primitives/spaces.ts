import { many1 } from '../combinators/many1';
import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { space } from './space';

const parser = many1(space);

/**
 * Parse one or more space characters.
 *
 * @example
 * spaces('   abc') // { ok: true, value: '   ', remaining: 'abc' }
 */
export const spaces = create<string>((input) => {
    const result = parser(input);

    if (!result.ok) {
        return failure();
    }

    return success(result.value.join(''), result.remaining);
});
