import type { Parser } from '../types';

export const run = <T>(parser: Parser<T>, input: string): T | null => {
    const result = parser(input);
    if (!result) {
        return null;
    }

    const remainder = result[1].trim();

    return remainder === '' ? result[0] : null;
};
