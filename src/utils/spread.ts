/**
 * @example
 * collect spread arguments into an array
 * spread()(1, 2, 3) // [1, 2, 3]
 */
export const spread = () => {
    return <T>(...haystack: ReadonlyArray<T>): ReadonlyArray<T> => {
        return haystack;
    };
};
