import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { string } from './string';

describe('string', () => {
    it('should match exact string at beginning of input', () => {
        const parser = string('test');
        const result = parser('testing');

        assertSuccess<'test'>(result, 'test', 'ing');
    });

    it('should fail when string does not match', () => {
        const parser = string('test');
        const result = parser('hello');

        assertFailure<'test'>(result);
    });

    it('should match entire input', () => {
        const parser = string('hello');
        const result = parser('hello');

        assertSuccess<'hello'>(result, 'hello', '');
    });

    it('should handle empty string', () => {
        const parser = string('');
        const result = parser('anything');

        assertSuccess<''>(result, '', 'anything');
    });
});
