export const join = (separator: string = '') => {
    return <T extends ReadonlyArray<unknown>>(haystack: T): string => {
        return haystack.join(separator);
    };
};
