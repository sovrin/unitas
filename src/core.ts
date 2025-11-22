import { Grammar, Parser } from './types';
import { lazy } from './combinators';

export const run = <T>(parser: Parser<T>, input: string): T | null => {
    const result = parser(input);
    if (!result) {
        return null;
    }

    const remainder = result[1].trim();

    return remainder === '' ? result[0] : null;
};

export const grammar = <T extends Record<string, unknown>>(
    definitions: Grammar<T>,
): { [K in keyof T]: Parser<T[K]> } => {
    const parsers = {} as { [K in keyof T]: Parser<T[K]> };

    for (const key in definitions) {
        parsers[key] = lazy(() => definitions[key](parsers));
    }

    return parsers;
};
