import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { word } from './word';

describe('word', () => {
    it('should parse whole words with word boundaries', () => {
        {
            const parser = word('test');
            const result = parser('test abc');

            assertSuccess<string>(result, 'test', 'abc');
        }
        {
            const parser = word('hello');
            const result = parser('hello world');

            assertSuccess<string>(result, 'hello', 'world');
        }
    });

    it('should fail when word is part of larger word', () => {
        {
            const parser = word('test');
            const result = parser('testing');

            assertFailure<string>(result);
        }
        {
            const parser = word('cat');
            const result = parser('category');

            assertFailure<string>(result);
        }
    });

    it('should work with punctuation following', () => {
        {
            const parser = word('test');
            const result = parser('test!');

            assertSuccess<string>(result, 'test', '!');
        }
        {
            const parser = word('word');
            const result = parser('word.');

            assertSuccess<string>(result, 'word', '.');
        }
    });
});
