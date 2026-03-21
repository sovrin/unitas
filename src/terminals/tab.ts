import { create } from '../core/parser';
import { char } from './char';

/**
 * Parse tab character.
 *
 * @example
 * tab('\ttext') // { ok: true, value: '\t', remaining: 'text' }
 */
export const tab = create<string>(char('\t'));
