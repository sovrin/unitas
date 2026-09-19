export type Location = { index: number; line: number; column: number };

/**
 * Converts a character offset into a 1-based line and column.
 *
 * @example
 * locate('a=1\nb=x', 5) // { index: 5, line: 2, column: 2 }
 */
export const locate = (input: string, index: number): Location => {
    const clamped = Math.max(0, Math.min(index, input.length));

    let line = 1;
    let lineStart = 0;

    for (let i = 0; i < clamped; i++) {
        if (input.charCodeAt(i) === 10) {
            line++;
            lineStart = i + 1;
        }
    }

    return { index: clamped, line, column: clamped - lineStart + 1 };
};
