import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import type { char } from './char';
import { type Char } from './char';

/**
 * Parse any character from a set.
 *
 * @example
 * charOf(['a', 'b', 'c'])('abc') // { ok: true, value: 'a', index: 1, furthest: -1, expected: [] }
 */
export function charOf<S extends string>(
    chars: readonly Char<S>[],
): ReturnType<typeof char<Char<S>>>;
export function charOf(chars: readonly string[]) {
    const described = chars.map((c) => `'${c}'`);

    return create<string>((input, index = 0) => {
        const next = input[index];

        return index < input.length && chars.includes(next)
            ? success(next, index + 1)
            : failure(index, ...described);
    });
}
