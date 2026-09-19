import { describe, expect, it } from 'vitest';

import { many } from '../combinators/many';
import { sequence } from '../combinators/sequence';
import { digits } from '../primitives/digits';
import { letters } from '../primitives/letters';
import { char } from '../terminals/char';
import { parse } from './parse';

describe('parse', () => {
    it('should return the value when the whole input is consumed', () => {
        expect(parse(digits, '123')).toEqual({ ok: true, value: 123 });
    });

    it('should report where a failure happened instead of throwing', () => {
        const result = parse(sequence(letters, char('='), digits), 'port=x');

        expect(result.ok).toBe(false);
        expect(result).toMatchObject({ index: 5, line: 1, column: 6 });
        expect(result.ok === false && result.expected).toEqual(['digit']);
    });

    it('should report the line and column on a later line', () => {
        const result = parse(many(sequence(letters, char('\n'))), 'ab\ncd\n1');

        expect(result).toMatchObject({ line: 3, column: 1 });
    });

    it('should include a formatted excerpt', () => {
        const result = parse(digits, '12x');

        expect(result.ok === false && result.message).toContain('  1 | 12x');
    });
});
