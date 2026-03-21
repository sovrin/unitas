import { create } from '../core/parser';
import { literal } from './literal';

/**
 * Parse CRLF line ending.
 *
 * @example
 * crlf('\r\nabc') // { ok: true, value: '\r\n', remaining: 'abc' }
 */
export const crlf = create<string>(literal('\r\n'));
