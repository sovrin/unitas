import { create } from '../core/parser';
import { regex } from '../terminals/regex';

const parser = regex(/^[a-zA-Z_][a-zA-Z0-9_]*/);

/**
 * Parse an identifier — starts with letter or underscore, no leading digit, no hyphen.
 *
 * @example
 * identifier('variable_name') // { ok: true, value: 'variable_name', remaining: '' }
 */
export const identifier = create(parser);
