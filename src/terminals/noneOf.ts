import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse any character not in the set.
 *
 * @example
 * noneOf(['a', 'b', 'c'])('xyz') // { ok: true, value: 'x', remaining: 'yz' }
 */
export function noneOf(chars: readonly string[]) {
    return create<string>((input) => {
        return input.length > 0 && !chars.includes(input[0])
            ? success(input[0], input.slice(1))
            : failure();
    });
}
