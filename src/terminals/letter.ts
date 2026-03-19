import { type Result } from '../core/result';
import { type LowercaseLetter } from './lowercase';
import { satisfy } from './satisfy';
import { type UppercaseLetter } from './uppercase';

type Head<S extends string> = S extends `${infer C}${string}` ? C : never;
export type Letter = LowercaseLetter | UppercaseLetter;

const parser = satisfy<Letter>((c) => /[a-zA-Z]/.test(c));

export function letter<S extends `${Letter}${string}`>(
    input: S,
): Result<Head<S> & Letter>;
export function letter(input: string): Result<Letter>;
export function letter(input: string) {
    return parser(input);
}
