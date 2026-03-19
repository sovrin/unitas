import { type Result } from './result';

export type Parser<T = unknown> = (input: string) => Result<T>;

export const create = <T>(parserFn: Parser<T>): Parser<T> => {
    return (input) => {
        return parserFn(input);
    };
};
