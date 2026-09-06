import { locate } from './locate';

const describeFound = (input: string, index: number): string => {
    if (index >= input.length) return 'end of input';

    const char = input[index];
    const escaped = JSON.stringify(char).slice(1, -1);

    return `'${escaped}'`;
};

const describeExpected = (expected: readonly string[]): string => {
    if (expected.length === 0) return 'expected something else';
    if (expected.length === 1) return `expected ${expected[0]}`;

    const sorted = [...expected].sort();
    const last = sorted.pop();

    return `expected ${sorted.join(', ')} or ${last}`;
};

/**
 * Renders a parse failure as a source excerpt with a caret under the offset.
 *
 * @example
 * format('a=1,b=x', 6, ['digit']) // "1:7 expected digit, found 'x'\n  1 | a=1,b=x\n    |       ^"
 */
export const format = (
    input: string,
    index: number,
    expected: readonly string[],
): string => {
    const { line, column } = locate(input, index);
    const lines = input.split('\n');
    const source = lines[line - 1] ?? '';
    const gutter = String(line);
    const pad = ' '.repeat(gutter.length);
    const headline = `${line}:${column} ${describeExpected(expected)}, found ${describeFound(input, index)}`;

    return [
        headline,
        `  ${gutter} | ${source}`,
        `  ${pad} | ${' '.repeat(column - 1)}^`,
    ].join('\n');
};
