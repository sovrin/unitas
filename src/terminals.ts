import { failure, success } from './results';
import { create } from './combinators';

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

type Char<S extends string = string> =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    S extends `${infer _}${infer Rest}` ? (Rest extends '' ? S : never) : never;

export const char = <S extends string>(expected: Char<S>) => {
    if ((expected as string).length > 1) {
        throw new Error('char expects one character, but got ' + expected as string);
    }

    return create<S>((input) =>
        input.length > 0 && input[0] === expected
            ? success(expected, input.slice(1))
            : failure(),
    );
};
