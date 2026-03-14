import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';

export const skip = <T>(parser: Parser<T>, count: number) => {
    return create<null>((input) => {
        let remaining = input;

        for (let i = 0; i < count; i++) {
            const result = parser(remaining);
            if (!result) {
                return failure();
            }
            remaining = result[1];
        }

        return success(null, remaining);
    });
};
