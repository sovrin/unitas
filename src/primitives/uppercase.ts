import { type Context } from '../core/context';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { satisfy } from '../terminals/satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type UppercaseLetter =
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z';

const parser = satisfy<UppercaseLetter>(
    (c) => /[A-Z]/.test(c),
    'uppercase letter',
);

/**
 * Parses a single uppercase letter.
 *
 * @example
 * uppercase('ABC') // { ok: true, value: 'A', index: 1 }
 */
export function uppercase<S extends `${UppercaseLetter}${string}`>(
    input: S,
    index?: number,
    ctx?: Context,
): Result<Head<S> & UppercaseLetter>;
export function uppercase(
    input: string,
    index?: number,
    ctx?: Context,
): Result<UppercaseLetter>;
export function uppercase(input: string, index = 0, ctx?: Context) {
    return create<UppercaseLetter>(parser)(input, index, ctx);
}
