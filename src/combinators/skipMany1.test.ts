import { describe, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { skipMany1 } from './skipMany1';

describe('skipMany1', () => {
    it('should skip one or more occurrences and return null', () => {
        const parser1 = createTestParser('A');

        const parser = skipMany1(parser1);
        const result = parser('AAABBB');

        assertResult<null>(result, [null, 'BBB']);
    });

    it('should fail when no matches found', () => {
        const parser1 = createTestParser('A');

        const parser = skipMany1(parser1);
        const result = parser('BBB');

        assertResult<null>(result);
    });

    it('should succeed with single match', () => {
        const parser1 = createTestParser('A');

        const parser = skipMany1(parser1);
        const result = parser('ABBB');

        assertResult<null>(result, [null, 'BBB']);
    });

    it('should require at least one match', () => {
        const parser1 = createTestParser('A');

        const parser = skipMany1(parser1);
        const result = parser('B');

        assertResult<null>(result);
    });
});
