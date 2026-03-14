import type { Parser } from '../types';

import { create } from '../core/create';
import { failure } from '../core/failure';
import { success } from '../core/success';
import { exactly } from './exactly';
import { manyAtMost } from './manyAtMost';

export const manyBetween = <T>(parser: Parser<T>, min: number, max: number) => {
    return create<T[]>((input) => {
        const required = exactly(parser, min)(input);
        if (!required) {
            return failure();
        }

        const [more, rest] = manyAtMost(parser, max - min)(required[1])!;

        return success([...required[0], ...more], rest);
    });
};
