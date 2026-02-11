import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { Char } from '../types';

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
