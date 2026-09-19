import { lexeme } from '../combinators/lexeme';
import { create } from '../core/parser';
import { string } from './string';

/**
 * Parses a string as a token, skipping trailing whitespace.
 * Unlike word, it does not enforce word boundaries - useful for parsing
 * strings that might be followed by any character.
 *
 * @example
 * token('let')('let x') // { ok: true, value: 'let', index: 4 }
 * token('let')('let1') // { ok: true, value: 'let', index: 3 }
 * token('let')('let  x') // { ok: true, value: 'let', index: 5 }
 */
export const token = <T extends string>(input: T) => {
    return create<T>(lexeme(string(input)));
};
