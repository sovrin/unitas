import { create } from '../core/parser';
import { regex } from '../terminals/regex';

const parser = regex(/^[a-zA-Z0-9_-]+/);

/**
 * Parse a word-like value including hyphens.
 *
 * @example
 * literal('foo-bar'); // { ok: true, value: 'foo-bar', index: 7 }
 * literal('123abc'); // { ok: true, value: '123abc', index: 6 }
 */
export const literal = create(parser);
