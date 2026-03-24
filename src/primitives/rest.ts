import { create } from '../core/parser';
import { success } from '../core/success';

/**
 * Parse the rest of the input.
 *
 * @example
 * rest('hello') // { ok: true, value: 'hello', remaining: '' }
 */
export const rest = create<string>((input) => success(input, ''));
