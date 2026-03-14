import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { exactly } from './exactly';
import { many } from './many';

export const manyAtLeast = <T>(parser: Parser<T>, n: number) => {
    return create<T[]>((input) => {
        const required = exactly(parser, n)(input);
        if (!required) {
            return failure();
        }

        const [more, rest] = many(parser)(required[1])!;

        return success([...required[0], ...more], rest);
    });
};
