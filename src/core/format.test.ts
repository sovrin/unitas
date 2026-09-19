import { describe, expect, it } from 'vitest';

import { format } from './format';

describe('format', () => {
    it('should point a caret at the offset', () => {
        expect(format('a=1,b=x', 6, ['digit'])).toBe(
            ["1:7 expected digit, found 'x'", '  1 | a=1,b=x', '    |       ^'].join('\n'),
        );
    });

    it('should report the line the offset falls on', () => {
        expect(format('one\ntwo\nthree', 8, ['digit'])).toBe(
            ["3:1 expected digit, found 't'", '  3 | three', '    | ^'].join('\n'),
        );
    });

    it('should say end of input when there is nothing at the offset', () => {
        expect(format('ab', 2, ['digit'])).toContain('found end of input');
    });

    it('should escape a control character rather than print it raw', () => {
        expect(format('a\nb', 1, ['digit'])).toContain("found '\\n'");
    });

    it('should list several expectations', () => {
        expect(format('x', 0, ['digit', 'letter', 'comma'])).toContain(
            'expected comma, digit or letter',
        );
    });

    it('should fall back when nothing was expected', () => {
        expect(format('x', 0, [])).toContain('expected something else');
    });

    it('should widen the gutter for larger line numbers', () => {
        const input = Array.from({ length: 10 }, () => 'x').join('\n');

        expect(format(input, 18, ['digit'])).toBe(
            ["10:1 expected digit, found 'x'", '  10 | x', '     | ^'].join('\n'),
        );
    });
});
