import { Parser, ParseResult } from './types';
import { create, failure, success } from './core';

export const leftAssoc = <T>(term: Parser<T>, operator: Parser<(left: T, right: T) => T>) =>
    create<T>((input) => {
        const firstResult = term(input);
        if (!firstResult) return failure();

        let [accumulator, remaining] = firstResult;

        while (true) {
            const opResult = operator(remaining);
            if (!opResult) break;

            const nextResult = term(opResult[1]);
            if (!nextResult) break;

            accumulator = opResult[0](accumulator, nextResult[0]);
            remaining = nextResult[1];
        }

        return success(accumulator, remaining);
    });

export const rightAssoc = <T>(term: Parser<T>, operator: Parser<(left: T, right: T) => T>) =>
    create<T>((input) => {
        const leftResult = term(input);
        if (!leftResult) return failure();

        const tryRightSide = (leftValue: T, remaining: string): ParseResult<T> => {
            const opResult = operator(remaining);
            if (!opResult) return success(leftValue, remaining);

            const rightResult = rightAssoc(term, operator)(opResult[1]);
            if (!rightResult) return success(leftValue, remaining);

            const combinedValue = opResult[0](leftValue, rightResult[0]);
            return success(combinedValue, rightResult[1]);
        };

        return tryRightSide(leftResult[0], leftResult[1]);
    });

export const chainl = <T>(parser: Parser<T>, operator: Parser<(a: T, b: T) => T>, defaultValue: T) =>
    create<T>((input) => {
        const result = chainl1(parser, operator)(input);

        return result ? success(...result) : success(defaultValue, input);
    });

export const chainl1 = <T>(parser: Parser<T>, operator: Parser<(a: T, b: T) => T>) =>
    create<T>(leftAssoc(parser, operator));

export const chainr = <T>(parser: Parser<T>, operator: Parser<(a: T, b: T) => T>, defaultValue: T) =>
    create<T>((input) => {
        const result = chainr1(parser, operator)(input);

        return result ? success(...result) : success(defaultValue, input);
    });

export const chainr1 = <T>(parser: Parser<T>, operator: Parser<(a: T, b: T) => T>) =>
    create<T>(rightAssoc(parser, operator));

export const prefix = <T>(operator: Parser<(value: T) => T>, atom: Parser<T>) =>
    create<T>((input) => {
        const operators: Array<(value: T) => T> = [];
        let remaining = input;

        while (true) {
            const opResult = operator(remaining);
            if (!opResult) break;
            operators.push(opResult[0]);
            remaining = opResult[1];
        }

        const atomResult = atom(remaining);
        if (!atomResult) return failure();

        const finalValue = operators.reduceRight((value, op) => op(value), atomResult[0]);

        return success(finalValue, atomResult[1]);
    });

export const postfix = <T>(atom: Parser<T>, operator: Parser<(value: T) => T>) =>
    create<T>((input) => {
        const atomResult = atom(input);
        if (!atomResult) return failure();

        let [value, remaining] = atomResult;

        while (true) {
            const opResult = operator(remaining);
            if (!opResult) break;
            value = opResult[0](value);
            remaining = opResult[1];
        }

        return success(value, remaining);
    });
