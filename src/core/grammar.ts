import type { Parser } from '../core/parser';

import { lazy } from './lazy';

export type Grammar<T extends Record<string, unknown>> = {
    [K in keyof T]: (parsers: { [P in keyof T]: Parser<T[P]> }) => Parser<T[K]>;
};

/**
 * Creates a recursive grammar where rules can reference each other.
 *
 * @example
 * type Math = {
 *   expr: number;
 *   term: number;
 *   value: number;
 * };
 * const g = grammar<Math>({
 *   expr: (p) => chainLeft1(p.term, map(char('+'), () => (l, r) => l + r)),
 *   term: (p) => choice(p.value, map(sequence(char('('), p.expr, char(')')), ([, v]) => v)),
 *   value: () => digits,
 * });
 * run(g.expr, '1+2') // 3
 * run(g.expr, '1+2+3') // 6
 * run(g.expr, '(1+2)') // 3
 */
export const grammar = <T extends Record<string, unknown>>(
    definitions: Grammar<T>,
): { [K in keyof T]: Parser<T[K]> } => {
    const parsers = {} as { [K in keyof T]: Parser<T[K]> };

    for (const key in definitions) {
        parsers[key] = lazy(() => definitions[key](parsers));
    }

    return parsers;
};
