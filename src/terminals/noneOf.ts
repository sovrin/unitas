import { reject } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse any character not in the set.
 *
 * @example
 * noneOf(['a', 'b', 'c'])('xyz') // { ok: true, value: 'x', index: 1 }
 */
export function noneOf(chars: readonly string[]) {
    const described = [
        `character other than ${chars.map((c) => `'${c}'`).join(', ')}`,
    ];

    return create<string>((input, index = 0, ctx) => {
        return index < input.length && !chars.includes(input[index])
            ? success(input[index], index + 1)
            : reject(ctx, index, described);
    });
}
