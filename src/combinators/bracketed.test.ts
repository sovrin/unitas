import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { bracketed } from './bracketed';

describe('bracketed', () => {
    it('should parse bracketed content', () => {
        const parser = bracketed(createTestParser('ABC'));
        const result = parser('[ABC]');

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should fail with uneven brackets', () => {
        const parser = bracketed(createTestParser('ABC'));
        const result = parser('[ABC');

        assertFailure<'ABC'>(result);
    });

    it('should leave remaining input', () => {
        const parser = bracketed(createTestParser('ABC'));
        const result = parser('[ABC]rest');

        assertSuccess<'ABC'>(result, 'ABC', 'rest');
    });

    it('should handle empty brackets input', () => {
        const parser = bracketed(createTestParser(''));
        const result = parser('[]');

        assertSuccess<''>(result, '', '');
    });
});
