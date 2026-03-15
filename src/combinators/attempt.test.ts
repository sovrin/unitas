import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { attempt } from './attempt';

describe('attempt', () => {
    it('should run parser and return result on success', () => {
        const parser1 = createTestParser('A');
        const parser = attempt(parser1);
        const result = parser('ABC');

        assertSuccess<string>(result, 'A', 'BC');
    });

    it('should backtrack on failure', () => {
        const parser1 = createTestParser('A');
        const parser = attempt(parser1);
        const result = parser('BAC');

        assertFailure(result);
    });
});
