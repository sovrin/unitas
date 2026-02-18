import type { Grammar, Parser } from '../types';
import { lazy } from './lazy';

export const grammar = <T extends Record<string, unknown>>(
    definitions: Grammar<T>,
): { [K in keyof T]: Parser<T[K]> } => {
    const parsers = {} as { [K in keyof T]: Parser<T[K]> };

    for (const key in definitions) {
        parsers[key] = lazy(() => definitions[key](parsers));
    }

    return parsers;
};
