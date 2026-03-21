import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Get current position (remaining input length).
 *
 * @example
 * position('abc') // { ok: true, value: 3, remaining: 'abc' }
 */
export const position = create<number>((input) => success(input.length, input));
