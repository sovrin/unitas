import type { Result } from '../types';

import { satisfy } from './satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type UppercaseLetter =
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z';

const parser = satisfy<UppercaseLetter>((c) => /[A-Z]/.test(c));

export function uppercase<S extends `${UppercaseLetter}${string}`>(
    input: S,
): Result<Head<S> & UppercaseLetter>;
export function uppercase(input: string): Result<UppercaseLetter>;
export function uppercase(input: string) {
    return parser(input);
}
