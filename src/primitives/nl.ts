import { create } from '../core/parser';
import { satisfy } from '../terminals/satisfy';

const parser = satisfy<'\n'>((c) => /\n/.test(c));

/**
 * Parse a newline character.
 *
 * @example
 * nl('\ntext') // { ok: true, value: '\n', remaining: 'text' }
 */
export const nl = create<'\n'>(parser);
