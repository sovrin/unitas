export const spread = () => {
    return <T>(...haystack: ReadonlyArray<T>): ReadonlyArray<T> => {
        return haystack;
    };
};
