import type { Parser } from '../core/parser';

import { failure } from '../core/failure';
import { create } from '../core/parser';
import { success } from '../core/success';

export const skip = <T>(parser: Parser<T>, count: number) => {
    return create<null>((input) => {
        let remaining = input;

        for (let i = 0; i < count; i++) {
            const result = parser(remaining);
            if (!result.ok) {
                return failure();
            }
            remaining = result.remaining;
        }

        return success(null, remaining);
    });
};
