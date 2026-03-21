/**
 * @example
 * get the first element of an array
 * shift()([1, 2, 3]) // 1
 */
export const shift = () => {
    return <T extends ReadonlyArray<unknown>>(haystack: T): T[0] => {
        return haystack.at(0) as T[0];
    };
};
