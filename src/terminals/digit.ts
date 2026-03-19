import { map } from '../combinators/map';
import { satisfy } from './satisfy';

export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export const digit = map<Digit, number>(
    satisfy<Digit>((c) => /^[0-9]$/.test(c)),
    (c) => parseInt(c, 10),
);
