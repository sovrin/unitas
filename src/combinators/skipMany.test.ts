import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { skipMany } from './skipMany';

describe('skipMany', () => {
    it('should skip many occurrences and return null', () => {
        const parser1 = createTestParser('A');
        const parser = skipMany(parser1);
        const result = parser('AAABBB');

        assertResult<null>(result, [null, 'BBB']);
    });

    it('should return null even when no matches found', () => {
        const parser1 = createTestParser('A');
        const parser = skipMany(parser1);
        const result = parser('BBB');

        assertResult<null>(result, [null, 'BBB']);
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser = skipMany(parser1);
        const result = parser('');

        assertResult<null>(result, [null, '']);
    });
});
