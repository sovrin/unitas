import { map } from '../combinators/map';
import { create } from '../core/parser';
import { satisfy } from '../terminals/satisfy';

export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

const parser = map<Digit, number>(
    satisfy<Digit>((c) => /^[0-9]$/.test(c)),
    (c) => parseInt(c, 10),
);

/**
 * Parse a single digit and return as number.
 *
 * @example
 * digit('5abc') // { ok: true, value: 5, remaining: 'abc' }
 */
export const digit = create<number>(parser);
