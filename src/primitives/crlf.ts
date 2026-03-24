import { create } from '../core/parser';
import { string } from '../terminals/string';

const parser = string('\r\n');

/**
 * Parse CRLF line ending.
 *
 * @example
 * crlf('\r\nabc') // { ok: true, value: '\r\n', remaining: 'abc' }
 */
export const crlf = create<string>(parser);
