import { type Context } from '../core/context';
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

const parser = satisfy<HexDigit>((c) => /[0-9a-fA-F]/.test(c), 'hex digit');

/**
 * Parse a single hexadecimal digit.
 *
 * @example
 * hexDigit('fF9') // { ok: true, value: 'f', index: 1 }
 */
export function hexDigit<S extends `${HexDigit}${string}`>(
    input: S,
    index?: number,
    ctx?: Context,
): Result<Head<S> & HexDigit>;
export function hexDigit(
    input: string,
    index?: number,
    ctx?: Context,
): Result<HexDigit>;
export function hexDigit(input: string, index = 0, ctx?: Context) {
    return create<HexDigit>(parser)(input, index, ctx);
}
