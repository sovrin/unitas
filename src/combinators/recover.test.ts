import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { recover } from './recover';

describe('recover', () => {
    it('should return parser result when parser succeeds', () => {
        const parser1 = createTestParser('A');
        const parser = recover(parser1, 'B');
        const result = parser('AAA');

        assertResult<'A' | 'B'>(result, ['A', 'AA']);
    });

    it('should return fallback value when parser fails and not consume input', () => {
        const parser1 = createTestParser('A');
        const parser = recover(parser1, 'B');
        const result = parser('CCC');

        assertResult<'A' | 'B'>(result, ['B', 'CCC']);
    });
});
