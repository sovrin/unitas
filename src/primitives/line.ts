import { create } from '../core/parser';
import { takeWhile } from '../terminals/takeWhile';

const parser = takeWhile((c) => c !== '\n' && c !== '\r');

/**
 * Parse until end of line.
 *
 * @example
 * line('hello\nworld') // { ok: true, value: 'hello', remaining: '\nworld' }
 */
export const line = create<string>(parser);
