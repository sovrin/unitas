import { create } from '../core/parser';
import { type Result } from '../core/result';
import { satisfy } from '../terminals/satisfy';
import { type LowercaseLetter } from './lowercase';
import { type UppercaseLetter } from './uppercase';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type Letter = LowercaseLetter | UppercaseLetter;

const parser = satisfy<Letter>((c) => /[a-zA-Z]/.test(c));

/**
 * Parse a single letter.
 *
 * @example
 * letter('abc') // { ok: true, value: 'a', remaining: 'bc' }
 */
export function letter<S extends `${Letter}${string}`>(
    input: S,
): Result<Head<S> & Letter>;
export function letter(input: string): Result<Letter>;
export function letter(input: string) {
    return create<Letter>(parser)(input);
}
