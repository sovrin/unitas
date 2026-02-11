import { describe, it } from 'vitest';
import { literal } from './literal';
import { bracketed } from './bracketed';
import { assertResult } from '../../test/utils.test';

describe('bracketed', () => {
    it('should parse bracketed content', () => {
        const parser1 = literal('ABC');
        const parser = bracketed(parser1);
        const result = parser('[ABC]');

        assertResult<'ABC'>(result, ['ABC', '']);
    });

    it('should fail with uneven brackets', () => {
        const parser1 = literal('ABC');
        const parser = bracketed(parser1);
        const result = parser('[ABC');

        assertResult<'ABC'>(result);
    });

    it('should handle empty brackets', () => {
        const parser1 = literal('');
        const parser = bracketed(parser1);
        const result = parser('[]');

        assertResult<''>(result, ['', '']);
    });
});
