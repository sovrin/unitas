import { create } from '../core/create';
import { success } from '../core/success';
import { failure } from '../core/failure';

export const regex = (pattern: RegExp) => {
    if (pattern.global) {
        throw new Error('Global flag is not supported in regex parsers');
    }

    return create<string>((input) => {
        const match = input.match(pattern);

        return match && match.index === 0
            ? success(match[0], input.slice(match[0].length))
            : failure();
    });
};
