import type { Parser } from '../core/parser';

/**
 * Runs a parser and returns the value, throws on failure or unconsumed input.
 *
 * @example
 * run(string('hello'), 'hello') // 'hello'
 */
export const run = <T>(parser: Parser<T>, input: string): T => {
    const result = parser(input);
    if (!result.ok) {
        if (result.error === undefined) {
            throw new Error('Parsing failed: Unexpected error');
        }

        throw new Error(`Parsing failed: ${result.error}`);
    }

    const { value, remaining } = result;
    if (remaining !== '') {
        throw new Error(`Not all input consumed: "${remaining}"`);
    }

    return value;
};
