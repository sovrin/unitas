import type { LowercaseLetter, Result } from '../types';

import { satisfy } from './satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;

const parser = satisfy<LowercaseLetter>((c) => /[a-z]/.test(c));

export function lowercase<S extends `${LowercaseLetter}${string}`>(
    input: S,
): Result<Head<S> & LowercaseLetter>;
export function lowercase(input: string): Result<LowercaseLetter>;
export function lowercase(input: string) {
    return parser(input);
}
