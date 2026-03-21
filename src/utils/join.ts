/**
 * Join array elements into a string.
 *
 * @example
 * join()([1, 2, 3])       // '123'
 * join('-')([1, 2, 3])    // '1-2-3'
 */
export const join = (separator: string = '') => {
    return <T extends ReadonlyArray<unknown>>(haystack: T): string => {
        return haystack.join(separator);
    };
};
