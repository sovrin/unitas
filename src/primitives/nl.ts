import { create } from '../core/parser';
import { satisfy } from '../terminals/satisfy';

const parser = satisfy<'\n'>((c) => /\n/.test(c), 'newline');

/**
 * Parse a newline character.
 *
 * @example
 * nl('\ntext') // { ok: true, value: '\n', index: 1 }
 */
export const nl = create<'\n'>(parser);
