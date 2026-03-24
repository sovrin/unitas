import type { Parser } from '../core/parser';

import { create } from '../core/parser';
import { regex } from '../terminals/regex';
import { map } from './map';
import { sequence } from './sequence';

/**
 * Parser that consumes trailing whitespace.
 *
 * @example
 * lexeme(string('hello'))('hello   world') // { ok: true, value: 'hello', remaining: 'world' }
 */
export const lexeme = <T>(parser: Parser<T>) => {
    return create<T>(map(sequence(parser, regex(/^\s*/)), ([value]) => value));
};
