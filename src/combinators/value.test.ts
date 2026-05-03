import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { value } from './value';

describe('value', () => {
    const aParser = createTestParser('A');

    it('should replace parsed value with constant', () => {
        const parser = value(aParser, 42);
        const result = parser('ABC');

        assertSuccess<number>(result, 42, 'BC');
    });

    it('should work with boolean constant', () => {
        const parser = value(aParser, true);
        const result = parser('ABC');

        assertSuccess<boolean>(result, true, 'BC');
    });

    it('should work with null constant', () => {
        const parser = value(aParser, null);
        const result = parser('ABC');

        assertSuccess<null>(result, null, 'BC');
    });

    it('should fail when underlying parser fails', () => {
        const parser = value(aParser, 42);
        const result = parser('XYZ');

        assertFailure<number>(result);
    });
});
