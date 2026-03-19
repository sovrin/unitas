export const shift = () => {
    return <T extends ReadonlyArray<unknown>>(haystack: T): T[0] => {
        return haystack.at(0) as T[0];
    };
};
