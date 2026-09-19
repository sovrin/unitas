import { map } from '../combinators/map';
import { create } from '../core/parser';
import { regex } from '../terminals/regex';

const parser = map(regex(/^-?\d+/), (match: string) => parseInt(match, 10));

/**
 * Parse a signed integer.
 *
 * @example
 * integer('42') // { ok: true, value: 42, index: 2 }
 * integer('-7') // { ok: true, value: -7, index: 2 }
 * integer('123abc') // { ok: true, value: 123, index: 3 }
 */
export const integer = create<number>(parser);
