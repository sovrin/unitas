import { describe, expect, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { attempt } from './attempt';

describe('attempt', () => {
    it('should run parser and return result on success', () => {
        const parser1 = createTestParser('A');
        const parser = attempt(parser1);
        const result = parser('ABC');

        assertResult<string>(result, ['A', 'BC']);
    });

    it('should backtrack on failure', () => {
        const parser1 = createTestParser('A');
        const parser = attempt(parser1);
        const result = parser('BAC');

        expect(result).toBeNull();
    });
});
