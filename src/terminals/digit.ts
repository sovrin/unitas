import { map } from '../combinators/map';
import { satisfy } from './satisfy';

export const digit = map<string, number>(
    satisfy((c: string) => /^[0-9]$/.test(c)),
    (c) => parseInt(c, 10),
);
