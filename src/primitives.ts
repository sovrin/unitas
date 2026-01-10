import { failure, success } from './results';
import { create, many1, map } from './combinators';
import { Char, Letter, LowerCaseLetter, UpperCaseLetter } from './types';

export function satisfy<T extends string>(predicate: (c: Char<T>) => boolean) {
    return create<T>((input) => {
        const c = input[0] as Char<T>;
        return input.length > 0 && predicate(c)
            ? success(c as T, input.slice(1))
            : failure();
    });
}

export const digit = map<string, number>(
    satisfy((c: string) => /^[0-9]$/.test(c)),
    (c) => parseInt(c, 10),
);

export const digits = create<number>((input) => {
    const result = many1(digit)(input);
    if (!result) {
        return failure();
    }

    const [ds, rest] = result;
    const value = ds.reduce((acc, d) => acc * 10 + d, 0);

    return success(value, rest);
});

export const letter = satisfy<Letter>((c) => /[a-zA-Z]/.test(c));

export const whitespace = satisfy<' '>((c) => /\s/.test(c));

export const uppercase = satisfy<UpperCaseLetter>((c) => /[A-Z]/.test(c));

export const lowercase = satisfy<LowerCaseLetter>((c) => /[a-z]/.test(c));
