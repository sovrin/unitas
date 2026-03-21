import { lexeme } from '../combinators/lexeme';
import { create } from '../core/parser';
import { literal } from './literal';

/**
 * Parses a literal string as a token, skipping trailing whitespace.
 *
 * @example
 * token('let')('let x') // { ok: true, value: 'let', remaining: 'x' }
 */
export const token = <T extends string>(str: T) => {
    return create<T>(lexeme(literal(str)));
};
