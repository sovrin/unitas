import { create } from '../core/parser';
import { type Result } from '../core/result';
import { satisfy } from '../terminals/satisfy';
import { type Digit } from './digit';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type HexDigit =
    | Digit
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F';

const parser = satisfy<HexDigit>((c) => /[0-9a-fA-F]/.test(c));

/**
 * Parse a single hexadecimal digit.
 *
 * @example
 * hexDigit('fF9') // { ok: true, value: 'f', remaining: 'F9' }
 */
export function hexDigit<S extends `${HexDigit}${string}`>(
    input: S,
): Result<Head<S> & HexDigit>;
export function hexDigit(input: string): Result<HexDigit>;
export function hexDigit(input: string) {
    return create<HexDigit>(parser)(input);
}
