import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { literal } from './literal';

describe('literal', () => {
    it('should match exact string at beginning of input', () => {
        const parser = literal('test');
        const result = parser('testing');

        assertSuccess<'test'>(result, 'test', 'ing');
    });

    it('should fail when string does not match', () => {
        const parser = literal('test');
        const result = parser('hello');

        assertFailure<'test'>(result);
    });

    it('should match entire input', () => {
        const parser = literal('hello');
        const result = parser('hello');

        assertSuccess<'hello'>(result, 'hello', '');
    });

    it('should handle empty string literal', () => {
        const parser = literal('');
        const result = parser('anything');

        assertSuccess<''>(result, '', 'anything');
    });
});
