import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { forward } from '../core/forward';
import { chainLeft1 } from './chainLeft1';
import { optional } from './optional';

export const chainLeft = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
) => {
    return create<T | null>((input) => {
        const result = optional(chainLeft1(parser, operator))(input);
        if (!result.ok || result.value === null) {
            return failure();
        }

        return forward(result);
    });
};
