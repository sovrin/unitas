export type Parser<T = unknown> = (input: string) => Result<T>;
export type Result<T> = Success<T> | Failure;
export type Success<T> = readonly [T, string];
export type Failure = null;
export type Grammar<T extends Record<string, unknown>> = {
    [K in keyof T]: (parsers: { [P in keyof T]: Parser<T[P]> }) => Parser<T[K]>;
};
