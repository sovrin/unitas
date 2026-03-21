import { create, failure, success } from '../src';

export const operation = create((input) => {
    const ops: Record<string, (left: number, right: number) => number> = {
        '+': (left, right) => left + right,
        '-': (left, right) => left - right,
        '*': (left, right) => left * right,
        '/': (left, right) => left / right,
        '**': (left, right) => Math.pow(left, right),
    };

    const [operator] = input.match(/\*\*|[+\-*/]/) || [];
    if (!operator) return failure();

    const op = ops[operator];

    return success(op, input.slice(operator.length));
});

export const digits = create<number>((value: string) => {
    const [, match, rest] = value.match(/^(\d+)(.*)/) || ['0'];
    if (!match) return failure();

    return success<number>(parseInt(match), rest);
});
