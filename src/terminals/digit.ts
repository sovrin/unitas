import type { Digit } from '../types';

import { map } from '../combinators/map';
import { satisfy } from './satisfy';

export const digit = map<Digit, number>(
    satisfy<Digit>((c) => /^[0-9]$/.test(c)),
    (c) => parseInt(c, 10),
);
