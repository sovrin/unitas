import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse first character that exists in string (like charOf but for a string).
 *
 * @example
 * stringOf('abc')('abcdef') // { ok: true, value: 'a', remaining: 'bcdef' }
 */
export const stringOf = (chars: string) => {
    return create<string>((input) =>
        input.length > 0 && chars.includes(input[0])
            ? success(input[0], input.slice(1))
            : failure(),
    );
};
