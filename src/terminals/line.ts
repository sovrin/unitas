import { create } from '../core/parser';
import { takeWhile } from './takeWhile';

/**
 * Parse until end of line.
 *
 * @example
 * line('hello\nworld') // { ok: true, value: 'hello', remaining: '\nworld' }
 */
export const line = create<string>(takeWhile((c) => c !== '\n' && c !== '\r'));
