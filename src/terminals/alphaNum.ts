import { type Result } from '../core/result';
import { type Digit } from './digit';
import { type Letter } from './letter';
import { satisfy } from './satisfy';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type AlphaNum = Letter | Digit;

const parser = satisfy<AlphaNum>((c) => /[a-zA-Z0-9]/.test(c));

/**
 * Parse a single alphanumeric character.
 *
 * @example
 * alphaNum('a1') // { ok: true, value: 'a', remaining: '1' }
 * alphaNum('1a') // { ok: true, value: '1', remaining: 'a' }
 */
export function alphaNum<S extends `${AlphaNum}${string}`>(
    input: S,
): Result<Head<S> & AlphaNum>;
export function alphaNum(input: string): Result<AlphaNum>;
export function alphaNum(input: string) {
    return parser(input);
}
