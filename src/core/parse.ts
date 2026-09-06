import type { Parser } from './parser';

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
 * parse(digits, '12x').message // "1:3 expected end of input, found 'x'\n  1 | 12x\n    |   ^"
 */
export const parse = <T>(parser: Parser<T>, input: string): ParseResult<T> => {
    const result = parser(input, 0);
    const problem = diagnose(input, result);

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
