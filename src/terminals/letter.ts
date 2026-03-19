import type { Letter, Result } from '../types';

import { satisfy } from './satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;

const parser = satisfy<Letter>((c) => /[a-zA-Z]/.test(c));

export function letter<S extends `${Letter}${string}`>(
    input: S,
): Result<Head<S> & Letter>;
export function letter(input: string): Result<Letter>;
export function letter(input: string) {
    return parser(input);
}
