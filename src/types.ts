export type Parser<T = unknown> = (input: string) => Result<T>;

export type Success<T> = { ok: true; value: T; remaining: string };
export type Failure = { ok: false; error?: string };
export type Result<T> = Success<T> | Failure;

export type Char<S extends string = string> =
    S extends `${infer _}${infer Rest}` ? (Rest extends '' ? S : never) : never;

export type First<T extends readonly unknown[]> = T extends readonly [
    infer F,
    ...unknown[],
]
    ? F
    : never;

export type Last<T extends readonly unknown[]> = T extends readonly [
    ...unknown[],
    infer L,
]
    ? L
    : never;
