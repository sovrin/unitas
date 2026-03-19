import type { Result } from '../types';

import { satisfy } from './satisfy';

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

const parser = satisfy<LowercaseLetter>((c) => /[a-z]/.test(c));

export function lowercase<S extends `${LowercaseLetter}${string}`>(
    input: S,
): Result<Head<S> & LowercaseLetter>;
export function lowercase(input: string): Result<LowercaseLetter>;
export function lowercase(input: string) {
    return parser(input);
}
