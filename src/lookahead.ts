import { Parser } from './types';
import { create, failure, success } from './core';

export const lookahead = <T>(parser: Parser<T>) =>
    create<T>((input) => {
        const result = parser(input);

        return result ? success(result[0], input) : failure();
    });

export const peek = <T>(parser: Parser<T>) => lookahead(parser);

export const notFollowedBy = <T>(parser: Parser<T>) =>
    create<undefined>((input) => {
        const result = parser(input);

        return result ? failure() : success(undefined, input);
    });

export const followedBy = <T>(parser: Parser<T>) =>
    create<undefined>((input) => {
        const result = parser(input);

        return result ? success(undefined, input) : failure();
    });
