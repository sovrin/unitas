import type { Parser, Success } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { many } from './many';

/**
 * one or more occurrences with failure on zero
 */
export const many1 = <T>(parser: Parser<T>) => {
    return create<T[]>((input) => {
        const result = parser(input);
        if (!result.ok) {
            return failure();
        }

        const { value: manyValue, remaining: manyRemainder } = many(parser)(
            result.remaining,
        ) as Success<T[]>;

        return success([result.value, ...manyValue], manyRemainder);
    });
};
