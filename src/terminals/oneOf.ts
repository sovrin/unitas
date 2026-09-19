import { reject } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse one string from a set of strings (longest match wins).
 *
 * @example
 * oneOf(['hello', 'hell', 'help'])('helpful') // { ok: true, value: 'help', index: 4 }
 */
export const oneOf = <S extends string>(strings: readonly [S, ...S[]]) => {
    const described = strings.map((s) => `'${s}'`);

    return create<S>((input, index = 0, ctx) => {
        for (const str of strings) {
            if (input.startsWith(str, index)) {
                return success(str, index + str.length);
            }
        }

        return reject(ctx, index, described);
    });
};
