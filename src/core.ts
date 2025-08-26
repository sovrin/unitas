import { Grammar, Parser, ParseResult } from './types';
import { lazy } from './combinators';

export const parse = <T>(parser: Parser<T>, input: string): T | null => {
    const result = parser(input);
    if (!result) return null;

    const remainingInput = result[1].trim();
    return remainingInput === '' ? result[0] : null;
};

export const grammar = <T extends Record<string, unknown>>(
    definitions: Grammar<T>,
): { [K in keyof T]: Parser<T[K]> } => {
    const parsers = {} as { [K in keyof T]: Parser<T[K]> };
    const cache: Partial<{ [K in keyof T]: Parser<T[K]> }> = {};

    for (const key in definitions) {
        const typedKey = key as Extract<keyof T, string>;

        parsers[key] = lazy(() => {
            return (cache[typedKey] ??= definitions[typedKey]());
        });
    }

    return parsers;
};

export const create =
    <T>(parserFn: Parser<T>): Parser<T> =>
    (input) => {
        return parserFn(input);
    };

export const success = <T>(value: T, remaining: string): ParseResult<T> => [value, remaining];

export const failure = <T = unknown>(): ParseResult<T> => null;

export const fail = <T>() => create<T>(() => failure());

export const literal = (str: string) =>
    create<string>((input) => (input.startsWith(str) ? success(str, input.slice(str.length)) : failure()));

export const regex = (pattern: RegExp) =>
    create<string>((input) => {
        const match = input.match(pattern);

        return match && match.index === 0 ? success(match[0], input.slice(match[0].length)) : failure();
    });

export const char = (expected: string) =>
    create<string>((input) =>
        input.length > 0 && input[0] === expected ? success(input[0], input.slice(1)) : failure(),
    );

export const satisfy = (predicate: (char: string) => boolean) =>
    create<string>((input) =>
        input.length > 0 && predicate(input[0]) ? success(input[0], input.slice(1)) : failure(),
    );

export const oneOf = (chars: string) =>
    create<string>((input) =>
        input.length > 0 && chars.includes(input[0]) ? success(input[0], input.slice(1)) : failure(),
    );

export const noneOf = (chars: string) =>
    create<string>((input) =>
        input.length > 0 && !chars.includes(input[0]) ? success(input[0], input.slice(1)) : failure(),
    );

export const take = (count: number) =>
    create<string>((input) => (input.length >= count ? success(input.slice(0, count), input.slice(count)) : failure()));

export const takeWhile = (predicate: (char: string) => boolean) =>
    create<string>((input) => {
        let index = 0;
        while (index < input.length && predicate(input[index])) {
            index++;
        }

        return success(input.slice(0, index), input.slice(index));
    });

export const takeUntil = (predicate: (char: string) => boolean) =>
    create<string>((input) => {
        let index = 0;
        while (index < input.length && !predicate(input[index])) {
            index++;
        }

        return success(input.slice(0, index), input.slice(index));
    });
