import { create } from '../core/parser';
import { type Result } from '../core/result';
import { satisfy } from '../terminals/satisfy';
import { type LowercaseLetter } from './lowercase';
import { type UppercaseLetter } from './uppercase';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type Letter = LowercaseLetter | UppercaseLetter;

const parser = satisfy<Letter>((c) => /[a-zA-Z]/.test(c), 'letter');

/**
 * Parse a single letter.
 *
 * @example
 * letter('abc') // { ok: true, value: 'a', index: 1, furthest: -1, expected: [] }
 */
export function letter<S extends `${Letter}${string}`>(
    input: S,
    index?: number,
): Result<Head<S> & Letter>;
export function letter(input: string, index?: number): Result<Letter>;
export function letter(input: string, index = 0) {
    return create<Letter>(parser)(input, index);
}
