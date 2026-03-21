import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { alphaNum, type AlphaNum } from './alphaNum';

describe('alphaNum', () => {
    it('should parse letter', () => {
        const result = alphaNum('a1');

        assertSuccess<AlphaNum>(result, 'a', '1');
    });

    it('should parse digit', () => {
        const result = alphaNum('1a');

        assertSuccess<AlphaNum>(result, '1', 'a');
    });

    it('should fail on non-alphanumeric', () => {
        const result = alphaNum('!abc');

        assertFailure<AlphaNum>(result);
    });

    it('should fail on empty input', () => {
        const result = alphaNum('');

        assertFailure<AlphaNum>(result);
    });

    it('should narrow result to first character type for const string', () => {
        const result = alphaNum('a1' as const);

        assertSuccess<'a'>(result, 'a', '1');
    });
});
