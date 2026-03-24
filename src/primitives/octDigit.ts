import { create } from '../core/parser';
import { type Result } from '../core/result';
import { satisfy } from '../terminals/satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type OctDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

const parser = satisfy<OctDigit>((c) => /[0-7]/.test(c));

/**
 * Parse a single octal digit.
 *
 * @example
 * octDigit('7abc') // { ok: true, value: '7', remaining: 'abc' }
 */
export function octDigit<S extends `${OctDigit}${string}`>(
    input: S,
): Result<Head<S> & OctDigit>;
export function octDigit(input: string): Result<OctDigit>;
export function octDigit(input: string) {
    return create<OctDigit>(parser)(input);
}
