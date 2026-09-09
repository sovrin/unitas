import { create } from '../core/parser';
import { satisfy } from '../terminals/satisfy';

const parser = satisfy<string>((c) => /\s/.test(c), 'whitespace');

/**
 * Parses a single whitespace character.
 *
 * @example
 * whitespace(' abc') // { ok: true, value: ' ', index: 1 }
 */
export const whitespace = create<string>(parser);
