import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { chainRight1 } from './chainRight1';
import { optional } from './optional';

export const chainRight = <T>(
    parser: Parser<T>,
    operator: Parser<(a: T, b: T) => T>,
) => {
    return create<T | null>((input) => {
        const result = optional(chainRight1(parser, operator))(input);

        if (!result) return failure();

        const [value] = result;
        return value === null ? failure() : success(value, result[1]);
    });
};
