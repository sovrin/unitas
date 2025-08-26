import { char, create, failure, regex, satisfy, success, takeWhile } from './core';
import { choice, map } from './combinators';
import { many1 } from './repetition';
import { string } from './text';

export const digit = create<number>((input) => {
    const result = satisfy((c) => /[0-9]/.test(c))(input);

    return result ? success(parseInt(result[0], 10), result[1]) : failure();
});

export const digits = create<number>(
    map(many1(digit), (digitArray) => {
        return digitArray.reduce((acc, d) => acc * 10 + d, 0);
    }),
);

export const integer = create<number>((input) => {
    const result = regex(/^[+-]?\d+/)(input);

    return result ? success(parseInt(result[0], 10), result[1]) : failure();
});

export const float = create<number>((input) => {
    const result = regex(/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?/)(input);

    return result ? success(parseFloat(result[0]), result[1]) : failure();
});

export const line = create<string>(takeWhile((c) => c !== '\n' && c !== '\r'));

export const letter = create<string>(satisfy((c) => /[a-zA-Z]/.test(c)));

export const alphaNum = create<string>(satisfy((c) => /[a-zA-Z0-9]/.test(c)));

export const upper = create<string>(satisfy((c) => /[A-Z]/.test(c)));

export const lower = create<string>(satisfy((c) => /[a-z]/.test(c)));

export const space = create<string>(satisfy((c) => /\s/.test(c)));

export const tab = create<string>(char('\t'));

export const newline = create<string>(char('\n'));

export const eof = create<null>((input) => (input.length === 0 ? success(null, input) : failure()));

export const crlf = create<string>(string('\r\n'));

export const endOfLine = create<string>(
    choice(
        newline,
        crlf,
        map(eof, () => ''),
    ),
);

export const whitespace = create<string>(regex(/^\s*/));

export const identifier = create<string>((input) => {
    const result = regex(/^[a-zA-Z_][a-zA-Z0-9_]*/)(input);

    return result ? success(result[0], result[1]) : failure();
});

export const naturalNumber = create<number>((input) => {
    const result = regex(/^[0-9]+/)(input);

    return result ? success(parseInt(result[0], 10), result[1]) : failure();
});
export const hexNumber = create<number>((input) => {
    const result = regex(/^0[xX][0-9a-fA-F]+/)(input);

    return result ? success(parseInt(result[0], 16), result[1]) : failure();
});

export const rest = create<string>((input) => success(input, ''));

export const position = create<number>((input) => success(input.length, input));

export const anyChar = create<string>((input) => (input.length > 0 ? success(input[0], input.slice(1)) : failure()));
