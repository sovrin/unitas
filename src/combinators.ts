import { Parser } from './types';
import { failure, success } from './results';

export const sequence = <T extends readonly unknown[]>(
    ...parsers: { [K in keyof T]: Parser<T[K]> }
) => {
    return create<T>((input) => {
        const results: unknown[] = [];
        let remaining = input;

        for (const parser of parsers) {
            const result = parser(remaining);
            if (!result) {
                return failure();
            }

            results.push(result[0]);
            remaining = result[1];
        }

        return success(results as unknown as T, remaining);
    });
};

export const create = <T>(parserFn: Parser<T>): Parser<T> => {
    return (input) => {
        return parserFn(input);
    };
};
export const lazy = <T>(thunk: () => Parser<T>) => {
    return create<T>((input) => thunk()(input));
};
