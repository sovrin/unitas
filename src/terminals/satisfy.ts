import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';
import { type Char } from './char';

/**
 * Parse a character satisfying a predicate.
 *
 * @example
 * satisfy((c) => c === 'a')('abc') // { ok: true, value: 'a', remaining: 'bc' }
 */
export function satisfy<T extends string>(predicate: (c: Char<T>) => boolean) {
    return create<T>((input) => {
        const c = input[0] as Char<T>;
        return input.length > 0 && predicate(c)
            ? success(c as T, input.slice(1))
            : failure();
    });
}
