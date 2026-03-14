import {create} from '../core/create';
import {failure} from '../core/failure';
import type {Parser} from '../types';

export const guard = <T>(condition: boolean, parser: Parser<T>) => {
    return create<T | null>((input) => {
        if (!condition) {
            return failure();
        }

        const result = parser(input);
        return result ? result : failure();
    });
};
