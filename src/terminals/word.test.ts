import { describe, it } from 'vitest';
import { word } from './word';
import { assertResult } from '../../test/utils.test';

describe('word', () => {
    it('should parse whole words with word boundaries', () => {
        {
            const parser = word('test');
            const result = parser('test abc');

            assertResult<string>(result, ['test', 'abc']);
        }
        {
            const parser = word('hello');
            const result = parser('hello world');

            assertResult<string>(result, ['hello', 'world']);
        }
    });

    it('should fail when word is part of larger word', () => {
        {
            const parser = word('test');
            const result = parser('testing');

            assertResult<string>(result);
        }
        {
            const parser = word('cat');
            const result = parser('category');

            assertResult<string>(result);
        }
    });

    it('should work with punctuation following', () => {
        {
            const parser = word('test');
            const result = parser('test!');

            assertResult<string>(result, ['test', '!']);
        }
        {
            const parser = word('word');
            const result = parser('word.');

            assertResult<string>(result, ['word', '.']);
        }
    });
});
