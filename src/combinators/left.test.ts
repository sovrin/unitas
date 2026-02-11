import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { left } from './left';

describe('left', () => {
    const parser1 = createTestParser('A');
    const parser2 = createTestParser('B');

    it('should return the first parser result and ignore the second', () => {
        const parser = left(parser1, parser2);
        const result = parser('AB');

        assertResult<'A'>(result, ['A', '']);
    });

    it('should fail if first parser fails', () => {
        const parser = left(parser1, parser2);
        const result = parser('goodbye world');

        assertResult<'A'>(result);
    });

    it('should fail if second parser fails', () => {
        const parser = left(parser1, parser2);
        const result = parser('hello universe');

        assertResult<'A'>(result);
    });
});
