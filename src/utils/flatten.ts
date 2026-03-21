import { type Prettify } from '../types';

type PickValue<T> = T extends ReadonlyArray<infer U> ? U : T;

type FlattenArray<T extends ReadonlyArray<unknown>> = Prettify<
    Array<PickValue<T[number]>>
>;

/**
 * Flatten nested arrays.
 *
 * @example
 * flatten()([1, [2, [3]]]) // [1, 2, [3]]
 * flatten(2)([1, [2, [3]]]) // [1, 2, 3]
 */
export const flatten = (depth: number = 1) => {
    return <T extends ReadonlyArray<unknown>>(haystack: T): FlattenArray<T> => {
        return haystack.flat(depth) as FlattenArray<T>;
    };
};
