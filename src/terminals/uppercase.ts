import type { Result, UppercaseLetter } from '../types';

import { satisfy } from './satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;

const parser = satisfy<UppercaseLetter>((c) => /[A-Z]/.test(c));

export function uppercase<S extends `${UppercaseLetter}${string}`>(
    input: S,
): Result<Head<S> & UppercaseLetter>;
export function uppercase(input: string): Result<UppercaseLetter>;
export function uppercase(input: string) {
    return parser(input);
}
