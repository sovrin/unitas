import { create } from '../core/parser';
import { satisfy } from '../terminals/satisfy';

const parser = satisfy<string>((c) => c === ' ');

/**
 * Parse a single space character.
 *
 * @example
 * space(' abc') // { ok: true, value: ' ', remaining: 'abc' }
 */
export const space = create<string>(parser);
