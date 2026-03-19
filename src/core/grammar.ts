import type { Parser } from '../core/parser';

import { lazy } from './lazy';

export type Grammar<T extends Record<string, unknown>> = {
    [K in keyof T]: (parsers: { [P in keyof T]: Parser<T[P]> }) => Parser<T[K]>;
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
