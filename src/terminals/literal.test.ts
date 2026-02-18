import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { literal } from './literal';

describe('literal', () => {
    it('should match exact string at beginning of input', () => {
        const parser = literal('test');
        const result = parser('testing');

        assertResult<'test'>(result, ['test', 'ing']);
    });

    it('should fail when string does not match', () => {
        const parser = literal('test');
        const result = parser('hello');

        assertResult<'test'>(result);
    });

    it('should match entire input', () => {
        const parser = literal('hello');
        const result = parser('hello');

        assertResult<'hello'>(result, ['hello', '']);
    });

    it('should handle empty string literal', () => {
        const parser = literal('');
        const result = parser('anything');

        assertResult<''>(result, ['', 'anything']);
    });
});
