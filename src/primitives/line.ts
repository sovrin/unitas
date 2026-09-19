import { create } from '../core/parser';
import { takeWhile } from '../terminals/takeWhile';

const parser = takeWhile((c) => c !== '\n' && c !== '\r');

/**
 * Parse until end of line.
 *
 * @example
 * line('hello\nworld') // { ok: true, value: 'hello', index: 5 }
 */
export const line = create<string>(parser);
