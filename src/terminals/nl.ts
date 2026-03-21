import { satisfy } from './satisfy';

/**
 * Parse a newline character.
 *
 * @example
 * nl('\ntext') // { ok: true, value: '\n', remaining: 'text' }
 */
export const nl = satisfy<'\n'>((c) => /\n/.test(c));
