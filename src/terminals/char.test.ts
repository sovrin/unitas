import { describe, expect, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { char } from './char';

describe('char', () => {
    it('should match single character', () => {
        const parser = char('A');
        const result = parser('ABC');

        assertResult<'A' | null>(result, ['A', 'BC']);
    });

    it('should fail when character does not match', () => {
        const parser = char('A');
        const result = parser('BCD');
        expect(result).toBeNull();

        assertResult<'A' | null>(result);
    });

    it('should fail on empty input', () => {
        const parser = char('A');
        const result = parser('');

        assertResult<'A' | null>(result);
    });

    it('should throw if more then one character is given', () => {
        expect(() => {
            char('foobar' as unknown as 'f');
        }).toThrowError('char expects one character, but got foobar');
    });
});
