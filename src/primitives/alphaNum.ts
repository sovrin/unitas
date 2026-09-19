import { type Context } from '../core/context';
import { create } from '../core/parser';
import { type Result } from '../core/result';
import { satisfy } from '../terminals/satisfy';
import { type Digit } from './digit';
import { type Letter } from './letter';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type AlphaNum = Letter | Digit;

const parser = satisfy<AlphaNum>(
    (c) => /[a-zA-Z0-9]/.test(c),
    'alphanumeric character',
);

/**
 * Parse a single alphanumeric character.
 *
 * @example
 * alphaNum('a1') // { ok: true, value: 'a', index: 1 }
 * alphaNum('1a') // { ok: true, value: '1', index: 1 }
 */
export function alphaNum<S extends `${AlphaNum}${string}`>(
    input: S,
    index?: number,
    ctx?: Context,
): Result<Head<S> & AlphaNum>;
export function alphaNum(
    input: string,
    index?: number,
    ctx?: Context,
): Result<AlphaNum>;
export function alphaNum(input: string, index = 0, ctx?: Context) {
    return create<AlphaNum>(parser)(input, index, ctx);
}
