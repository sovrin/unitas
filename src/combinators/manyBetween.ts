import { failure } from '../core/failure';
import { create, type Parser } from '../core/parser';
import { type Success, success } from '../core/success';
import { exactly } from './exactly';
import { manyAtMost } from './manyAtMost';

export const manyBetween = <T>(parser: Parser<T>, min: number, max: number) => {
    return create<T[]>((input) => {
        const required = exactly(parser, min)(input);
        if (!required.ok) {
            return failure();
        }

        const { value: more, remaining: rest } = manyAtMost(
            parser,
            max - min,
        )(required.remaining) as Success<T[]>;

        return success([...required.value, ...more], rest);
    });
};
