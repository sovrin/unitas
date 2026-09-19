import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { fuse } from './fuse';

describe('fuse', () => {
    it('should fuse single-char parsers into string', () => {
        const parser = fuse(
            createTestParser('a'),
            createTestParser('b'),
            createTestParser('c'),
        );
        const result = parser('abc');

        assertSuccess<string>(result, 'abc', 3);
    });

    it('should fail on non-matching input', () => {
        const parser = fuse(
            createTestParser('a'),
            createTestParser('b'),
            createTestParser('c'),
        );
        const result = parser('axc');

        assertFailure(result);
    });

    it('should fuse multi-char parsers into string', () => {
        const parser = fuse(
            createTestParser('hello'),
            createTestParser(' '),
            createTestParser('world'),
        );
        const result = parser('hello world');

        assertSuccess<string>(result, 'hello world', 11);
    });

    it('should fuse two parsers into string', () => {
        const parser = fuse(createTestParser('a'), createTestParser('b'));
        const result = parser('ab');

        assertSuccess<string>(result, 'ab', 2);
    });

    it('should work with single parser', () => {
        const parser = fuse(createTestParser('a'));
        const result = parser('a');

        assertSuccess<string>(result, 'a', 1);
    });
});
