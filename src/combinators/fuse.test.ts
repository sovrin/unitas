import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { char } from '../terminals/char';
import { string } from '../terminals/string';
import { fuse } from './fuse';

describe('fuse', () => {
    it('should fuse char parsers into string', () => {
        const abc = fuse(char('a'), char('b'), char('c'));
        const result = abc('abc');

        assertSuccess<string>(result, 'abc', '');
    });

    it('should fail on non-matching input', () => {
        const abc = fuse(char('a'), char('b'), char('c'));
        const result = abc('abd');

        assertFailure(result);
    });

    it('should fuse string parsers into string', () => {
        const hello = fuse(string('hello'), char(' '), string('world'));
        const result = hello('hello world');

        assertSuccess<string>(result, 'hello world', '');
    });

    it('should fuse two chars into string', () => {
        const ab = fuse(char('a'), char('b'));
        const result = ab('ab');

        assertSuccess<string>(result, 'ab', '');
    });

    it('should work with single parser', () => {
        const a = fuse(char('a'));
        const result = a('a');

        assertSuccess<string>(result, 'a', '');
    });
});
