import { describe, expect, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { char } from './char';

describe('char', () => {
    it('should match single character', () => {
        const parser = char('A');
        const result = parser('ABC');

        assertSuccess<'A' | null>(result, 'A', 'BC');
    });

    it('should fail when character does not match', () => {
        const parser = char('A');
        const result = parser('BCD');

        assertFailure<'A' | null>(result);
    });

    it('should fail on empty input', () => {
        const parser = char('A');
        const result = parser('');

        assertFailure<'A' | null>(result);
    });

    it('should throw if more then one character is given', () => {
        expect(() => {
            char('foobar' as unknown as 'f');
        }).toThrowError('char expects one character, but got foobar');
    });
});
