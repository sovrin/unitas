import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { anyChar } from './anyChar';

describe('anyChar', () => {
    it('should match any single character', () => {
        const result = anyChar('abc');

        assertSuccess<string>(result, 'a', 1);
    });

    it('should match special characters', () => {
        const result = anyChar('@#$');

        assertSuccess<string>(result, '@', 1);
    });

    it('should fail on empty input', () => {
        const result = anyChar('');

        assertFailure<string>(result);
    });
});
