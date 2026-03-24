import { map } from '../combinators/map';
import { create } from '../core/parser';
import { regex } from '../terminals/regex';

const parser = map(regex(/^-?\d+\.\d+/), (match: string) => parseFloat(match));

/**
 * Parse a floating point number.
 *
 * @example
 * float('1.23') // { ok: true, value: 1.23, remaining: '' }
 * float('-2.5') // { ok: true, value: -2.5, remaining: '' }
 * float('1.23abc') // { ok: true, value: 1.23, remaining: 'abc' }
 */
export const float = create<number>(parser);
