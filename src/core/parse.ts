import type { Parser } from './parser';

import { context } from './context';
import { format } from './format';
import { locate } from './locate';
import { diagnose } from './run';

export type ParseResult<T> =
    | { ok: true; value: T }
    | {
          ok: false;
          index: number;
          line: number;
          column: number;
          expected: readonly string[];
          message: string;
      };

/**
 * Runs a parser over the whole input without throwing.
 *
 * The non-throwing counterpart of {@link run}: on failure it reports the
 * offset, line, column, expectations and a formatted message.
 *
 * @example
 * parse(digits, '12x').ok // false
 */
export const parse = <T>(parser: Parser<T>, input: string): ParseResult<T> => {
    const ctx = context();
    const result = parser(input, 0, ctx);
    const problem = diagnose(input, result, ctx);

    if (!problem) {
        return { ok: true, value: (result as { value: T }).value };
    }

    const { index, expected } = problem;
    const { line, column } = locate(input, index);

    return {
        ok: false,
        index,
        line,
        column,
        expected,
        message: format(input, index, expected),
    };
};
