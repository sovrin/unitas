import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { satisfy } from './satisfy';

describe('satisfy', () => {
    it('should match character that satisfies predicate', () => {
        const parser = satisfy((c: string) => c >= '0' && c <= '9');
        const result = parser('5abc');

        assertSuccess<string>(result, '5', 'abc');
    });

    it('should fail when character does not satisfy predicate', () => {
        const parser = satisfy((c: string) => c >= '0' && c <= '9');
        const result = parser('abc');

        assertFailure<string>(result);
    });

    it('should fail on empty input', () => {
        const parser = satisfy(() => true);
        const result = parser('');

        assertFailure<string>(result);
    });
});
