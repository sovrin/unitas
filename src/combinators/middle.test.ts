import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { middle } from './middle';

describe('middle', () => {
    const parser1 = createTestParser('A');
    const parser2 = createTestParser('B');
    const parser3 = createTestParser('C');

    it('should return the middle parser result', () => {
        const parser = middle(parser1, parser2, parser3);
        const result = parser('ABC');

        assertResult<'B'>(result, ['B', '']);
    });

    it('should fail if first parser fails', () => {
        const parser = middle(parser1, parser2, parser3);
        const result = parser('[content)');

        assertResult<'B'>(result);
    });

    it('should fail if middle parser fails', () => {
        const parser = middle(parser1, parser2, parser3);
        const result = parser('(wrong)');

        assertResult<'B'>(result);
    });

    it('should fail if last parser fails', () => {
        const parser = middle(parser1, parser2, parser3);
        const result = parser('(content]');

        assertResult<'B'>(result);
    });
});
