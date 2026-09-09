import type { Parser } from './parser';

export type Grammar<T extends Record<string, unknown>> = {
    [K in keyof T]: (parsers: { [P in keyof T]: Parser<T[P]> }) => Parser<T[K]>;
};

/**
 * Wraps a rule so re-entering it at an offset it is already parsing throws a
 * named error instead of overflowing the stack.
 */
const guardLeftRecursion = <T>(
    name: string,
    thunk: () => Parser<T>,
): Parser<T> => {
    const active: number[] = [];

    return (input, index = 0, ctx) => {
        if (active.includes(index)) {
            throw new Error(
                `Left recursion detected in grammar rule "${name}" at offset ${index}. ` +
                    `Rewrite the rule to consume input before recursing — e.g. with chainLeft1 or many.`,
            );
        }

        active.push(index);

        try {
            return thunk()(input, index, ctx);
        } finally {
            active.pop();
        }
    };
};

/**
 * Creates a recursive grammar where rules can reference each other.
 *
 * Rules are resolved lazily through a shared record, so they may refer to one
 * another by name without forward declarations. Left-recursive rules are
 * reported by name rather than overflowing the stack.
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
        parsers[key] = guardLeftRecursion(key, () => definitions[key](parsers));
    }

    return parsers;
};
