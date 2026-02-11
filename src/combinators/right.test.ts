import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { right } from './right';

describe('right', () => {
    const parser1 = createTestParser('A');
    const parser2 = createTestParser('B');

    it('should return the second parser result and ignore the first', () => {
        const parser = right(parser1, parser2);
        const result = parser('AB');

        assertResult<'B'>(result, ['B', '']);
    });

    it('should fail if first parser fails', () => {
        const parser = right(parser1, parser2);
        const result = parser('goodbye world');

        assertResult<'B'>(result);
    });

    it('should fail if second parser fails', () => {
        const parser = right(parser1, parser2);
        const result = parser('hello universe');

        assertResult<'B'>(result);
    });
});
