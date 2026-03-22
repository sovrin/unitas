/**
 * Pick elements from an array by index.
 *
 * @example
 * pick(0, 2)(['a', 'b', 'c']) // ['a', 'c']
 * pick(2, 4)(['a', 'b', 'c', 'd', 'e']) // ['c', 'e']
 */
export const pick = <Indices extends number[]>(...indices: Indices) => {
    type Result<T extends ReadonlyArray<unknown>> = {
        readonly [K in keyof Indices]: T[Indices[K] & keyof T];
    };

    return <T extends ReadonlyArray<unknown>>(haystack: T): Result<T> => {
        return indices.map((i) => haystack[i]) as unknown as Result<T>;
    };
};
