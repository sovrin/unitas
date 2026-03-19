import type { HexDigit, Result } from '../types';

import { satisfy } from './satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;

const parser = satisfy<HexDigit>((c) => /[0-9a-fA-F]/.test(c));

export function hexDigit<S extends `${HexDigit}${string}`>(
    input: S,
): Result<Head<S> & HexDigit>;
export function hexDigit(input: string): Result<HexDigit>;
export function hexDigit(input: string) {
    return parser(input);
}
