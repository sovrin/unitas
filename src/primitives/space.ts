import { create } from '../core/parser';
import { satisfy } from '../terminals/satisfy';

const parser = satisfy<string>((c) => c === ' ', 'space');

/**
 * Parse a single space character.
 *
 * @example
 * space(' abc') // { ok: true, value: ' ', index: 1, furthest: -1, expected: [] }
 */
export const space = create<string>(parser);
