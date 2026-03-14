import type { Parser } from '../types';

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
        if (!result) {
            return failure();
        }

        const [manyValue, manyRemainder] = many(parser)(result[1])!;

        return success([result[0], ...manyValue], manyRemainder);
    });
};
