import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { alphaNum } from './alphaNum';

describe('alphaNum', () => {
    it('should parse alphanumeric characters', () => {
        const result = alphaNum('a1');
        assertResult<string>(result, ['a', '1']);
    });

    it('should fail on non-alphanumeric', () => {
        const result = alphaNum('!abc');
        assertResult<string>(result);
    });

    it('should fail on empty input', () => {
        const result = alphaNum('');
        assertResult<string>(result);
    });
});
