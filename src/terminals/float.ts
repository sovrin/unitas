import { map } from '../combinators/map';
import { regex } from './regex';

/**
 * Parse a floating point number.
 *
 * @example
 * float()('1.23') // { ok: true, value: 1.23, remaining: '' }
 * float()('-2.5') // { ok: true, value: -2.5, remaining: '' }
 * float()('1.23abc') // { ok: true, value: 1.23, remaining: 'abc' }
 */
export const float = () =>
    map(regex(/^-?\d+\.\d+/), (match) => parseFloat(match));
