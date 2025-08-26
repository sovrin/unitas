import { Parser } from './types';
import { create, failure, success } from './core';

export const guard = <T>(condition: boolean, parser: Parser<T>) =>
    create<T | null>((input) => (condition ? parser(input) : success(null, input)));

export const unless = <T>(condition: boolean, parser: Parser<T>) =>
    create<T | null>((input) => (!condition ? parser(input) : success(null, input)));

export const recover = <T>(parser: Parser<T>, fallback: T) =>
    create<T>((input) => {
        const result = parser(input);

        return result ? result : success(fallback, input);
    });

export const commit = <T>(parser: Parser<T>) =>
    create<T>((input) => {
        // In a more sophisticated implementation, this would mark a commit point
        return parser(input);
    });

export const validate = <T>(parser: Parser<T>, predicate: (value: T) => boolean) =>
    create<T>((input) => {
        const result = parser(input);
        if (!result) return failure();

        return predicate(result[0]) ? result : failure();
    });

export const transform = <A, B>(parser: Parser<A>, transformer: (value: A) => B | null) =>
    create<B>((input) => {
        const result = parser(input);
        if (!result) return failure();

        const transformed = transformer(result[0]);
        return transformed !== null ? success(transformed, result[1]) : failure();
    });

export const not = <T>(parser: Parser<T>) =>
    create<string>((input) => {
        if (input.length === 0) return failure();

        const result = parser(input);

        return result ? failure() : success(input[0], input.slice(1));
    });
