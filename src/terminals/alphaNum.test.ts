import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { alphaNum } from './alphaNum';

describe('alphaNum', () => {
    it('should parse alphanumeric characters', () => {
        const result = alphaNum('a1');
        assertSuccess<string>(result, 'a', '1');
    });

    it('should fail on non-alphanumeric', () => {
        const result = alphaNum('!abc');
        assertFailure<string>(result);
    });

    it('should fail on empty input', () => {
        const result = alphaNum('');
        assertFailure<string>(result);
    });
});
