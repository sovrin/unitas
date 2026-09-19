import { format } from './format';
import { locate } from './locate';

/**
 * Error thrown by {@link run} when a parse fails, carrying the offset, the
 * 1-based line/column and the set of expectations at that offset.
 *
 * @example
 * new ParseError('a=1,b=x', 6, ['digit']).line // 1
 */
export class ParseError extends Error {
    readonly index: number;
    readonly line: number;
    readonly column: number;
    readonly expected: readonly string[];

    constructor(input: string, index: number, expected: readonly string[]) {
        super(format(input, index, expected));

        const { line, column } = locate(input, index);

        this.name = 'ParseError';
        this.index = index;
        this.line = line;
        this.column = column;
        this.expected = expected;
    }
}
