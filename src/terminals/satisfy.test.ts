import { describe, expect, it } from 'vitest';
import { satisfy } from './satisfy';
import { assertResult } from '../../test/utils.test';

describe('satisfy', () => {
    it('should match character that satisfies predicate', () => {
        const parser = satisfy((c: string) => c >= '0' && c <= '9');
        const result = parser('5abc');

        assertResult<string>(result, ['5', 'abc']);
    });

    it('should fail when character does not satisfy predicate', () => {
        const parser = satisfy((c: string) => c >= '0' && c <= '9');
        const result = parser('abc');
        expect(result).toBeNull();

        assertResult<string>(result);
    });

    it('should fail on empty input', () => {
        const parser = satisfy(() => true);
        const result = parser('');
        expect(result).toBeNull();

        assertResult<string>(result);
    });
});
