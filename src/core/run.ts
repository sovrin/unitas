import type { Parser } from '../types';








export const run = <T>(parser: Parser<T>, input: string): T | null => {
    const result = parser(input);
    if (!result) {
        return null;
    }

    const [parsed, remainder] = result;
    if (remainder !== '') {
        throw new Error(`Not all input consumed: "${remainder}"`);
    }
    
    return parsed;
};
