import { create } from '../core/parser';
import { satisfy } from '../terminals/satisfy';

const parser = satisfy<string>((c) => /\s/.test(c));

/**
 * Parses a single whitespace character.
 *
 * @example
 * whitespace(' abc') //{ ok: true, value: ' ', remaining: 'abc' }
 */
export const whitespace = create<string>(parser);
