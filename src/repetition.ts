import { Parser } from './types';
import { create, failure, success } from './core';

/**
 * zero or more occurrences
 */
export const many = <T>(parser: Parser<T>) =>
    create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        while (true) {
            const result = parser(remaining);
            if (!result) break;

            // Prevent infinite loop: ensure progress is made
            if (result[1] === remaining) {
                break;
            }

            results.push(result[0]);
            remaining = result[1];
        }

        return success(results, remaining);
    });

/**
 * one or more occurrences with failure on zero
 */
export const many1 = <T>(parser: Parser<T>) =>
    create<T[]>((input) => {
        const result = parser(input);
        if (!result) return failure();

        const restResults = many(parser)(result[1]);

        return restResults ? success([result[0], ...restResults[0]], restResults[1]) : failure();
    });

export const count = <T>(parser: Parser<T>, n: number) =>
    create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        for (let i = 0; i < n; i++) {
            const result = parser(remaining);
            if (!result) return failure();
            results.push(result[0]);
            remaining = result[1];
        }

        return success(results, remaining);
    });

export const exactly = <T>(parser: Parser<T>, n: number) =>
    create<T[]>((input) => {
        return count(parser, n)(input);
    });

export const atMost = <T>(parser: Parser<T>, n: number) =>
    create<T[]>((input) => {
        const results: T[] = [];
        let remaining = input;

        for (let i = 0; i < n; i++) {
            const result = parser(remaining);
            if (!result) break;
            results.push(result[0]);
            remaining = result[1];
        }

        return success(results, remaining);
    });

export const atLeast = <T>(parser: Parser<T>, n: number) =>
    create<T[]>((input) => {
        const required = count(parser, n)(input);
        if (!required) return failure();

        const additional = many(parser)(required[1]);
        if (!additional) return failure();

        return success([...required[0], ...additional[0]], additional[1]);
    });

export const range = <T>(parser: Parser<T>, min: number, max: number) =>
    create<T[]>((input) => {
        const required = count(parser, min)(input);
        if (!required) return failure();

        const additional = atMost(parser, max - min)(required[1]);
        if (!additional) return failure();

        return success([...required[0], ...additional[0]], additional[1]);
    });

export const optional = <T>(parser: Parser<T>, defaultValue: T) =>
    create<T>((input) => {
        const result = parser(input);

        return result ? success(...result) : success(defaultValue, input);
    });

export const optionalMaybe = <T>(parser: Parser<T>) =>
    create<T | null>((input) => {
        const result = parser(input);

        return result ? success(...result) : success(null, input);
    });
