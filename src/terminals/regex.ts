import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const regex = <T = string>(pattern: RegExp) => {
    if (pattern.global) {
        throw new Error('Global flag is not supported in regex parsers');
    }

    return create<T>((input) => {
        const match = input.match(pattern);

        return match && match.index === 0
            ? success<T>(match[0] as T, input.slice(match[0].length))
            : failure();
    });
};
