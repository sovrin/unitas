import type { AlphaNum, Result } from '../types';

import { satisfy } from './satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;

const parser = satisfy<AlphaNum>((c) => /[a-zA-Z0-9]/.test(c));

export function alphaNum<S extends `${AlphaNum}${string}`>(
    input: S,
): Result<Head<S> & AlphaNum>;
export function alphaNum(input: string): Result<AlphaNum>;
export function alphaNum(input: string) {
    return parser(input);
}
