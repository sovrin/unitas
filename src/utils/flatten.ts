import { type Prettify } from '../types';

/**
 * @example
 * flatten nested arrays
 * flatten()([1, [2, [3]]]) // [1, 2, [3]]
 * flatten(2)([1, [2, [3]]]) // [1, 2, 3]
 */
type PickValue<T> = T extends ReadonlyArray<infer U> ? U : T;

type FlattenArray<T extends ReadonlyArray<unknown>> = Prettify<
    Array<PickValue<T[number]>>
>;

export const flatten = (depth: number = 1) => {
    return <T extends ReadonlyArray<unknown>>(haystack: T): FlattenArray<T> => {
        return haystack.flat(depth) as FlattenArray<T>;
    };
};
