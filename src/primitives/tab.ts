import { create } from '../core/parser';
import { char } from '../terminals/char';

const parser = char('\t');

/**
 * Parse tab character.
 *
 * @example
 * tab('\ttext') // { ok: true, value: '\t', index: 1, furthest: -1, expected: [] }
 */
export const tab = create<string>(parser);
