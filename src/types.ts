export type ParseResult<T> = readonly [T, string] | null;
export type Parser<T = unknown> = (input: string) => ParseResult<T>;
export type Grammar<T extends Record<string, unknown>> = {
    [K in keyof T]: () => Parser<T[K]>;
};
