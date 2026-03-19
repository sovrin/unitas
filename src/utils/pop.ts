type LastElement<T extends ReadonlyArray<unknown>> = T[Exclude<
    keyof T,
    keyof Tail<T>
>];

type Tail<T extends ReadonlyArray<unknown>> = ((...rest: T) => void) extends (
    h: unknown,
    ...r: infer R
) => void
    ? R
    : never;

export const pop = () => {
    return <T extends ReadonlyArray<unknown>>(haystack: T): LastElement<T> => {
        return haystack.at(-1) as LastElement<T>;
    };
};
