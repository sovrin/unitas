import { type Result } from '../core/result';
import { satisfy } from './satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type OctDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

const parser = satisfy<OctDigit>((c) => /[0-7]/.test(c));

export function octDigit<S extends `${OctDigit}${string}`>(
    input: S,
): Result<Head<S> & OctDigit>;
export function octDigit(input: string): Result<OctDigit>;
export function octDigit(input: string) {
    return parser(input);
}
