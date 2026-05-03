import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { space } from './space';

describe('space', () => {
    it('should parse a single space', () => {
        const result = space(' abc');

        assertSuccess<string>(result, ' ', 'abc');
    });

    it('should fail on tab', () => {
        const result = space('\tabc');

        assertFailure<string>(result);
    });

    it('should fail on newline', () => {
        const result = space('\nabc');

        assertFailure<string>(result);
    });

    it('should fail on non-space', () => {
        const result = space('abc');

        assertFailure<string>(result);
    });
});
