import { satisfy } from './satisfy';

/**
 * Parses a single whitespace character.
 *
 * @example
 * whitespace(' abc') //{ ok: true, value: ' ', remaining: 'abc' }
 */
export const whitespace = satisfy<string>((c) => /\s/.test(c));
