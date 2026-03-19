import { failure } from '../core/failure';
import { create } from '../core/parser';
import { type Char, char } from './char';

export function charOf<S extends string>(
    chars: readonly Char<S>[],
): ReturnType<typeof char<Char<S>>>;
export function charOf(chars: readonly string[]) {
    return create<string>((input) => {
        if (input.length === 0) {
            return failure();
        }

        const next = input[0];
        return chars.includes(next) ? char(next as Char)(input) : failure();
    });
}
