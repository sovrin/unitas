import { type Context } from '../core/context';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { satisfy } from '../terminals/satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type OctDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

const parser = satisfy<OctDigit>((c) => /[0-7]/.test(c), 'octal digit');

/**
 * Parse a single octal digit.
 *
 * @example
 * octDigit('7abc') // { ok: true, value: '7', index: 1 }
 */
export function octDigit<S extends `${OctDigit}${string}`>(
    input: S,
    index?: number,
    ctx?: Context,
): Result<Head<S> & OctDigit>;
export function octDigit(
    input: string,
    index?: number,
    ctx?: Context,
): Result<OctDigit>;
export function octDigit(input: string, index = 0, ctx?: Context) {
    return create<OctDigit>(parser)(input, index, ctx);
}
