import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { label } from './label';

describe('label', () => {
    it('should return success with parsed value', () => {
        const parser = createTestParser('A');
        const labeled = label(parser, 'letter');
        const result = labeled('ABC');

        assertSuccess(result, 'A', 'BC');
    });

    it('should include label in error message on failure', () => {
        const parser = createTestParser('A');
        const labeled = label(parser, 'letter');
        const result = labeled('BCD');

        assertFailure(result, 'expected letter');
    });
});
