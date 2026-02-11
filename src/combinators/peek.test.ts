import { describe, expect, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { peek } from './peek';

describe('peek', () => {
    it('should succeed when parser matches without consuming input', () => {
        const parser1 = createTestParser('A');
        const parser = peek(parser1);
        const result = parser('AB');

        assertResult<'A'>(result, ['A', 'AB']);
    });

    it('should fail when peek parser does not match', () => {
        const parser1 = createTestParser('A');
        const parser = peek(parser1);
        const result = parser('BC');

        assertResult<'A'>(result);
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser = peek(parser1);
        const result = parser('');
        expect(result).toBeNull();

        assertResult<'A'>(result);
    });
});
