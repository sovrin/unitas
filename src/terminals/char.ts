import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

export type Char<S extends string = string> =
    S extends `${infer _}${infer Rest}` ? (Rest extends '' ? S : never) : never;

/**
 * Parse a specific character.
 *
 * @example
 * char('A')('ABC') // { ok: true, value: 'A', remaining: 'BC' }
 */
export const char = <S extends string>(expected: Char<S>) => {
    if ((expected as string).length !== 1) {
        throw new Error(
            ('char expects one character, but got ' + expected) as string,
        );
    }

    return create<Char<S>>((input) =>
        input.length > 0 && input[0] === expected
            ? success(expected, input.slice(1))
            : failure(),
    );
};
