import { type Result } from './result';

export type Parser<T = unknown> = (input: string) => Result<T>;

/**
 * Creates a parser from a parser function.
 *
 * @example
 * create((input) => success('parsed', input.slice(6)))('hello world') // { ok: true, value: 'parsed', remaining: 'world' }
 */
export const create = <T>(parserFn: Parser<T>): Parser<T> => {
    return (input) => {
        return parserFn(input);
    };
};
