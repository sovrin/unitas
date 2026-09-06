import { type Result } from './result';

export type Parser<T = unknown> = (input: string, index?: number) => Result<T>;

/**
 * Creates a parser from a parser function.
 *
 * A parser reads `input` starting at `index` and never slices it — results
 * report the offset they reached, so positions stay meaningful all the way up
 * to the top-level error message.
 *
 * @example
 * create((input, index = 0) => success('parsed', index + 6))('hello world') // { ok: true, value: 'parsed', index: 6, furthest: -1, expected: [] }
 */
export const create = <T>(parserFn: Parser<T>): Parser<T> => {
    return parserFn;
};
