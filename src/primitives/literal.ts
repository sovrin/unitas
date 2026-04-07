import { create } from '../core/parser';
import { regex } from '../terminals/regex';

const parser = regex(/^[a-zA-Z0-9_-]+/);

/**
 * Parse a word-like value including hyphens.
 *
 * @example
 * literal('foo-bar'); // { ok: true, value: 'foo-bar', remaining: '' }
 * literal('123abc'); // { ok: true, value: '123abc', remaining: '' }
 */
export const literal = create(parser);
