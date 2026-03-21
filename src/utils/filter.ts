import { type Parser } from '../core';

type ExcludeValues<
    T extends readonly unknown[],
    U extends readonly unknown[],
> = T extends readonly (infer A)[]
    ? U extends readonly (infer B)[]
        ? A extends B
            ? never
            : A
        : never
    : never;

export const filter = <T extends readonly (Parser<unknown> | unknown)[]>(
    values: T,
    strict: boolean = false,
) => {
    return <H extends readonly unknown[]>(
        haystack: H,
    ): ExcludeValues<H, T>[] => {
        let result = haystack.filter(
            (item) => !values.includes(item),
        ) as ExcludeValues<H, T>[];
        if (strict) {
            return result.filter(Boolean);
        }

        return result;
    };
};
