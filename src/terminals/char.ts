import { reject } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

export type Char<S extends string = string> =
    S extends `${infer _}${infer Rest}` ? (Rest extends '' ? S : never) : never;

/**
 * Parse a specific character.
 *
 * @example
 * char('A')('ABC') // { ok: true, value: 'A', index: 1 }
 */
export const char = <S extends string>(expected: Char<S>) => {
    if ((expected as string).length !== 1) {
        throw new Error(
            ('char expects one character, but got ' + expected) as string,
        );
    }

    const described = [`'${expected}'`];

    return create<Char<S>>((input, index = 0, ctx) =>
        input[index] === expected
            ? success(expected, index + 1)
            : reject(ctx, index, described),
    );
};
