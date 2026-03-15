import type { Parser } from '../types';

import { create, failure, forward } from '../core';
import { chainRight1 } from './chainRight1';
import { optional } from './optional';

export const chainRight = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
) => {
    return create<T | null>((input) => {
        const result = optional(chainRight1(parser, operator))(input);
        if (!result.ok || result.value === null) {
            return failure();
        }

        return forward(result);
    });
};
