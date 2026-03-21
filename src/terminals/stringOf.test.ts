import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { stringOf } from './stringOf';

describe('stringOf', () => {
    const parser = stringOf('abc');

    it('should parse a character from the set', () => {
        const result = parser('abc');
        assertSuccess<string>(result, 'a', 'bc');
    });

    it('should fail on character not in set', () => {
        const result = parser('def');
        assertFailure<string>(result);
    });

    it('should fail on empty input', () => {
        const result = parser('');
        assertFailure<string>(result);
    });
});
