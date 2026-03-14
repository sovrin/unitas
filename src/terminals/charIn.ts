import type { Char } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { char } from './char';

export function charIn<S extends string>(
    chars: readonly Char<S>[],
): ReturnType<typeof char<Char<S>>>;
export function charIn(chars: readonly string[]) {
    return create<string>((input) => {
        if (input.length === 0) {
            return failure();
        }

        const next = input[0];
        return chars.includes(next) ? char(next as Char)(input) : failure();
    });
}
