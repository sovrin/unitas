import { map } from '../combinators/map';
import { create } from '../core/parser';
import { regex } from '../terminals/regex';

const parser = map(regex(/^-?\d+/), (match: string) => parseInt(match, 10));

/**
 * Parse a signed integer.
 *
 * @example
 * integer('42') // { ok: true, value: 42, remaining: '' }
 * integer('-7') // { ok: true, value: -7, remaining: '' }
 * integer('123abc') // { ok: true, value: 123, remaining: 'abc' }
 */
export const integer = create<number>(parser);
