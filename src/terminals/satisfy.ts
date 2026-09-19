import { reject } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { type Char } from './char';

/**
 * Parse a character satisfying a predicate.
 *
 * @example
 * satisfy((c) => c === 'a')('abc') // { ok: true, value: 'a', index: 1 }
 */
export function satisfy<T extends string>(
    predicate: (c: Char<T>) => boolean,
    expected = 'matching character',
) {
    const described = [expected];

    return create<T>((input, index = 0, ctx) => {
        const c = input[index] as Char<T>;

        return index < input.length && predicate(c)
            ? success(c as T, index + 1)
            : reject(ctx, index, described);
    });
}
