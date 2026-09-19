import { create, failure, success } from '../src';

const OPERATORS: Record<string, (left: number, right: number) => number> = {
    '+': (left, right) => left + right,
    '-': (left, right) => left - right,
    '*': (left, right) => left * right,
    '/': (left, right) => left / right,
    '**': (left, right) => Math.pow(left, right),
};

const OPERATOR = /\*\*|[+\-*/]/y;

export const operation = create((input, index = 0) => {
    OPERATOR.lastIndex = index;
    const [operator] = OPERATOR.exec(input) || [];
    if (!operator) return failure(undefined, index, 'operator');

    return success(OPERATORS[operator], index + operator.length);
});

const DIGITS = /\d+/y;

export const digits = create<number>((input, index = 0) => {
    DIGITS.lastIndex = index;
    const [match] = DIGITS.exec(input) || [];
    if (!match) return failure(undefined, index, 'digit');

    return success<number>(parseInt(match), index + match.length);
});
