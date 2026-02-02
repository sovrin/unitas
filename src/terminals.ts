import { failure, success } from './results';
import {
    Char,
    Letter,
    LowerCaseLetter,
    Parser,
    UpperCaseLetter,
} from './types';
import { create } from './core';
import { choice, many1, map, surrounded } from './combinators';

export const literal = <S extends string>(str: S) => {
    return create<S>((input) =>
        input.startsWith(str)
            ? success(str, input.slice(str.length))
            : failure(),
    );
};
export const regex = (pattern: RegExp) => {
    if (pattern.global) {
        throw new Error('Global flag is not supported in regex parsers');
    }

    return create<string>((input) => {
        const match = input.match(pattern);

        return match && match.index === 0
            ? success(match[0], input.slice(match[0].length))
            : failure();
    });
};

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

export function noneOf<S extends string>(
    chars: readonly Char<S>[],
): ReturnType<typeof char<Char<S>>>;
export function noneOf(chars: readonly string[]) {
    return create<string>((input) =>
        input.length > 0 && !chars.includes(input[0])
            ? success(input[0], input.slice(1))
            : failure(),
    );
}
export const take = (count: number) => {
    return create<string>((input) =>
        input.length >= count
            ? success(input.slice(0, count), input.slice(count))
            : failure(),
    );
};

export const takeWhile = (predicate: (char: string) => boolean) => {
    return create<string>((input) => {
        let index = 0;
        while (index < input.length && predicate(input[index])) {
            index++;
        }

        return success(input.slice(0, index), input.slice(index));
    });
};

export const takeUntil = (predicate: (char: string) => boolean) => {
    return create<string>((input) => {
        let index = 0;
        while (index < input.length && !predicate(input[index])) {
            index++;
        }

        return success(input.slice(0, index), input.slice(index));
    });
};

export const quoted = <T>(content: Parser<T>) => {
    return choice(
        surrounded(literal('"'), content),
        surrounded(literal("'"), content),
    );
};

export const parenthesized = <T>(content: Parser<T>) => {
    return surrounded(literal('('), content, literal(')'));
};

export const braced = <T>(content: Parser<T>) => {
    return surrounded(literal('{'), content, literal('}'));
};

export const bracketed = <T>(content: Parser<T>) => {
    return surrounded(literal('['), content, literal(']'));
};

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
