import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { spaces } from './spaces';

describe('spaces', () => {
    it('should parse one or more spaces', () => {
        const result = spaces('   abc');

        assertSuccess<string>(result, '   ', 'abc');
    });

    it('should parse single space', () => {
        const result = spaces(' abc');

        assertSuccess<string>(result, ' ', 'abc');
    });

    it('should fail on tab', () => {
        const result = spaces('\tabc');

        assertFailure<string>(result);
    });

    it('should fail on non-space', () => {
        const result = spaces('abc');

        assertFailure<string>(result);
    });
});
