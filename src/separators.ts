import { Parser } from './types';
import { create, failure, literal, success } from './core';
import { many, many1 } from './repetition';
import { map, sequence } from './combinators';
import { between } from './sequencing';

export const sepBy = <T>(parser: Parser<T>, separator: Parser) =>
    create<T[]>((input) => {
        const firstResult = parser(input);
        if (!firstResult) {
            return success([], input);
        }

        const results = [firstResult[0]];
        let remaining = firstResult[1];

        while (true) {
            const sepResult = separator(remaining);
            if (!sepResult) break;

            const nextResult = parser(sepResult[1]);
            if (!nextResult) {
                // If separator matched but parser failed, backtrack
                // Don't consume the separator
                break;
            }

            results.push(nextResult[0]);
            remaining = nextResult[1];
        }

        return success(results, remaining);
    });

export const sepBy1 = <T>(parser: Parser<T>, separator: Parser) =>
    create<T[]>((input) => {
        const result = sepBy(parser, separator)(input);
        if (!result) return failure();

        const [values, remaining] = result;
        if (values.length === 0) return failure();

        return success(values, remaining);
    });

export const sepEndBy = <T>(parser: Parser<T>, separator: Parser) =>
    create<T[]>((input) => {
        const result = sepBy(parser, separator)(input);
        if (!result) return failure();

        const [values, remaining] = result;
        const sepResult = separator(remaining);

        return success(values, sepResult ? sepResult[1] : remaining);
    });

export const sepEndBy1 = <T>(parser: Parser<T>, separator: Parser) =>
    create<T[]>((input) => {
        const result = sepBy1(parser, separator)(input);
        if (!result) return failure();

        const [values, remaining] = result;
        const sepResult = separator(remaining);

        return success(values, sepResult ? sepResult[1] : remaining);
    });

export const endBy = <T>(parser: Parser<T>, terminator: Parser) =>
    create<T[]>(many(map(sequence(parser, terminator), ([value]) => value)));

export const endBy1 = <T>(parser: Parser<T>, terminator: Parser) =>
    create<T[]>(many1(map(sequence(parser, terminator), ([value]) => value)));

export const interleaved = <T, S>(item: Parser<T>, separator: Parser<S>) =>
    create<Array<T | S>>((input) => {
        // Must start with an item
        const firstResult = item(input);
        if (!firstResult) return success([], input);

        const results: Array<T | S> = [firstResult[0]];
        let remaining = firstResult[1];

        while (true) {
            // Try separator
            const sepResult = separator(remaining);
            if (!sepResult) break;

            // Try next item after separator
            const nextResult = item(sepResult[1]);
            if (!nextResult) break; // No trailing separators allowed

            // Both separator and item succeeded
            results.push(sepResult[0]);
            results.push(nextResult[0]);
            remaining = nextResult[1];
        }

        return success(results, remaining);
    });

export const delimited = <T>(parser: Parser<T>, separator: Parser, terminator: Parser) =>
    create<T[]>((input) => {
        const items = sepBy(parser, separator)(input);
        if (!items) return failure();

        const term = terminator(items[1]);
        return term ? success(items[0], term[1]) : failure();
    });

export const delimitedBy = <T>(open: string, close: string, content: Parser<T>) =>
    create<T>(between(literal(open), content, literal(close)));
