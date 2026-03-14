import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { stringOf } from './stringOf';

describe('stringOf', () => {
    const parser = stringOf('abc');

    it('should parse a character from the set', () => {
        const result = parser('abc');
        assertResult<string>(result, ['a', 'bc']);
    });

    it('should fail on character not in set', () => {
        const result = parser('def');
        assertResult<string>(result);
    });

    it('should fail on empty input', () => {
        const result = parser('');
        assertResult<string>(result);
    });
});
