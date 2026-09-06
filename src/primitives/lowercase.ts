import { create } from '../core/parser';
import { type Result } from '../core/result';
import { satisfy } from '../terminals/satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type LowercaseLetter =
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z';

const parser = satisfy<LowercaseLetter>((c) => /[a-z]/.test(c), 'lowercase letter');

/**
 * Parse a single lowercase letter.
 *
 * @example
 * lowercase('abc') // { ok: true, value: 'a', index: 1, furthest: -1, expected: [] }
 */
export function lowercase<S extends `${LowercaseLetter}${string}`>(
    input: S,
    index?: number,
): Result<Head<S> & LowercaseLetter>;
export function lowercase(input: string, index?: number): Result<LowercaseLetter>;
export function lowercase(input: string, index = 0) {
    return create<LowercaseLetter>(parser)(input, index);
}
