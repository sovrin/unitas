import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { string } from '../terminals/string';
import { bracketed } from './bracketed';

describe('bracketed', () => {
    it('should parse bracketed content', () => {
        const parser1 = string('ABC');
        const parser = bracketed(parser1);
        const result = parser('[ABC]');

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should fail with uneven brackets', () => {
        const parser1 = string('ABC');
        const parser = bracketed(parser1);
        const result = parser('[ABC');

        assertFailure<'ABC'>(result);
    });

    it('should handle empty brackets', () => {
        const parser1 = string('');
        const parser = bracketed(parser1);
        const result = parser('[]');

        assertSuccess<''>(result, '', '');
    });
});
