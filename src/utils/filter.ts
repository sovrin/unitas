import type { Parser } from '../core/parser';

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

/**
 * Exclude values from array.
 *
 * @example
 * filter([1, 2, 3])([1, 2, 3, 4, 5]) // [4, 5]
 * filter([1, 2], true)([1, false, 3]) // [3]
 */
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
