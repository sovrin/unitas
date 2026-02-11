import { describe, it } from 'vitest';
import { assertResult, createTestParser } from '../../test/utils.test';
import { consume } from './consume';

describe('consume', () => {
    it('should consume parser result and return null', () => {
        const parser1 = createTestParser('A');
        const parser = consume(parser1);
        const result = parser('ABBB');

        assertResult<unknown>(result, [null, 'BBB']);
    });

    it('should fail when underlying parser fails', () => {
        const parser1 = createTestParser('A');
        const parser = consume(parser1);
        const result = parser('BBB');

        assertResult<null>(result, null);
    });
});
