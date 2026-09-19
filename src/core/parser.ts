import { type Context } from './context';
import { type Result } from './result';

export type Parser<T = unknown> = (
    input: string,
    index?: number,
    ctx?: Context,
) => Result<T>;

/**
 * Creates a parser from a parser function.
 *
 * A parser reads `input` from `index` and never slices it. The third argument
 * is the parse context — pass it on to any parser you call, so expectations
 * recorded inside your parser reach the final error message.
 *
 * @example
 * create((input, index = 0) => success('parsed', index + 6))('hello world') // { ok: true, value: 'parsed', index: 6 }
 */
export const create = <T>(parserFn: Parser<T>): Parser<T> => {
    return parserFn;
};
