import { Parser } from './types';
import { create, failure, success } from './core';
import { map } from './combinators';
import { many, many1 } from './repetition';

export const until = <T, U>(parser: Parser<T>, terminator: Parser<U>) =>
    create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        while (true) {
            const termResult = terminator(remaining);
            if (termResult) break;

            const parseResult = parser(remaining);
            if (!parseResult) return failure();

            results.push(parseResult[0]);
            remaining = parseResult[1];
        }

        return success(results, remaining);
    });

export const skipMany = <T>(parser: Parser<T>) => create<null>(map(many(parser), () => null));

export const skipMany1 = <T>(parser: Parser<T>) => create<null>(map(many1(parser), () => null));

export const consume = <T>(parser: Parser<T>) => create<null>(map(parser, () => null));
