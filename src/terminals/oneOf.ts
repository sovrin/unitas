import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse one string from a set of strings (longest match wins).
 *
 * @example
 * oneOf(['hello', 'hell', 'help'])('helpful') // { ok: true, value: 'help', remaining: 'ful' }
 */
export const oneOf = <S extends string>(strings: readonly [S, ...S[]]) => {
    return create<S>((input) => {
        for (const str of strings) {
            if (input.startsWith(str)) {
                return success(str, input.slice(str.length));
            }
        }

        return failure();
    });
};
