import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Takes characters while the predicate returns true.
 *
 * @example
 * takeWhile((c) => c !== 'x')('abcx') // { ok: true, value: 'abc', remaining: 'x' }
 */
export const takeWhile = (predicate: (char: string) => boolean) => {
    return create<string>((input) => {
        let index = 0;
        while (index < input.length && predicate(input[index])) {
            index++;
        }

        return success(input.slice(0, index), input.slice(index));
    });
};
