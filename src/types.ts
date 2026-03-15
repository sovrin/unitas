export type Parser<T = unknown> = (input: string) => Result<T>;

export type Success<T> = { ok: true; value: T; remaining: string };
export type Failure = { ok: false; error?: string };
export type Result<T> = Success<T> | Failure;

export type Grammar<T extends Record<string, unknown>> = {
    [K in keyof T]: (parsers: { [P in keyof T]: Parser<T[P]> }) => Parser<T[K]>;
};

export type Char<S extends string = string> =
    S extends `${infer _}${infer Rest}` ? (Rest extends '' ? S : never) : never;

export type First<T extends readonly unknown[]> = T extends readonly [
    infer F,
    ...unknown[],
]
    ? F
    : never;

export type Nth<
    T extends readonly unknown[],
    N extends number,
> = number extends N
    ? T[number] | undefined
    : N extends number
      ? `${N}` extends `-${string}` | `${string}.${string}`
          ? undefined
          : T extends readonly [...infer U]
            ? N extends keyof U
                ? U[N]
                : undefined
            : T[N]
      : never;

export type Last<T extends readonly unknown[]> = T extends readonly [
    ...unknown[],
    infer L,
]
    ? L
    : never;

export type Digit<T extends string> = T extends
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    ? true
    : false;

export type LowerCaseLetter =
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z';

export type UpperCaseLetter =
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z';

export type Letter = LowerCaseLetter | UpperCaseLetter;
