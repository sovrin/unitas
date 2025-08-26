import { describe, expect, it } from 'vitest';
import { braced, bracketed, literal, parenthesized, quoted, regex, string, stringCI, word } from '../src';

describe('text', () => {
    describe('string', () => {
        it('should match exact string', () => {
            const parser = string('hello');
            expect(parser('hello world')).toEqual(['hello', ' world']);
        });

        it('should fail when string does not match', () => {
            const parser = string('hello');
            expect(parser('goodbye')).toBeNull();
        });

        it('should handle empty string', () => {
            const parser = string('');
            expect(parser('anything')).toEqual(['', 'anything']);
        });

        it('should be case sensitive', () => {
            const parser = string('Hello');
            expect(parser('hello')).toBeNull();
            expect(parser('Hello')).toEqual(['Hello', '']);
        });
    });
    describe('stringCI', () => {
        it('should match string case-insensitively', () => {
            const parser = stringCI('hello');
            expect(parser('hello world')).toEqual(['hello', ' world']);
            expect(parser('HELLO world')).toEqual(['HELLO', ' world']);
            expect(parser('Hello world')).toEqual(['Hello', ' world']);
            expect(parser('hELLo world')).toEqual(['hELLo', ' world']);
        });

        it('should fail when string does not match', () => {
            const parser = stringCI('hello');
            expect(parser('goodbye')).toBeNull();
        });

        it('should preserve original case in result', () => {
            const parser = stringCI('test');
            expect(parser('TEST')).toEqual(['TEST', '']);
            expect(parser('Test')).toEqual(['Test', '']);
            expect(parser('tEsT')).toEqual(['tEsT', '']);
        });

        it('should handle mixed case patterns', () => {
            const parser = stringCI('JavaScript');
            expect(parser('javascript')).toEqual(['javascript', '']);
            expect(parser('JAVASCRIPT')).toEqual(['JAVASCRIPT', '']);
            expect(parser('jAvAsCrIpT')).toEqual(['jAvAsCrIpT', '']);
        });
    });
    describe('word', () => {
        it('should parse whole words with word boundaries', () => {
            const f = word('test');

            expect(word('test')('test abc')).toEqual(['test', 'abc']);
            expect(word('hello')('hello world')).toEqual(['hello', 'world']);
        });

        it('should fail when word is part of larger word', () => {
            expect(word('test')('testing')).toBeNull();
            expect(word('cat')('category')).toBeNull();
        });

        it('should work with punctuation following', () => {
            expect(word('test')('test!')).toEqual(['test', '!']);
            expect(word('word')('word.')).toEqual(['word', '.']);
        });
    });
    describe('quoted', () => {
        it('should parse double-quoted content', () => {
            const contentParser = literal('hello world');
            expect(quoted(contentParser)('"hello world"')).toEqual(['hello world', '']);
        });

        it('should parse single-quoted content', () => {
            const contentParser = literal('hello world');
            expect(quoted(contentParser)("'hello world'")).toEqual(['hello world', '']);
        });

        it('should fail with mismatched quotes', () => {
            const contentParser = literal('hello world');
            expect(quoted(contentParser)('"hello world\'')).toBeNull();
        });

        it('should handle empty quoted strings', () => {
            const contentParser = literal('');
            expect(quoted(contentParser)('""')).toEqual(['', '']);
        });
    });

    describe('parenthesized', () => {
        it('should parse parenthesized content', () => {
            const contentParser = literal('hello world');
            expect(parenthesized(contentParser)('(hello world)')).toEqual(['hello world', '']);
        });

        it('should fail with unmatched parentheses', () => {
            const contentParser = literal('hello world');
            expect(parenthesized(contentParser)('(hello world')).toBeNull();
        });

        it('should handle empty parentheses', () => {
            const contentParser = literal('');
            expect(parenthesized(contentParser)('()')).toEqual(['', '']);
        });
    });

    describe('braced', () => {
        it('should parse braced content', () => {
            const contentParser = literal('hello world');
            expect(braced(contentParser)('{hello world}')).toEqual(['hello world', '']);
        });

        it('should fail with unmatched braces', () => {
            const contentParser = literal('hello world');
            expect(braced(contentParser)('{hello world')).toBeNull();
        });

        it('should handle empty braces', () => {
            const contentParser = literal('');
            expect(braced(contentParser)('{}')).toEqual(['', '']);
        });
    });

    describe('bracketed', () => {
        it('should parse bracketed content', () => {
            const contentParser = literal('hello world');
            expect(bracketed(contentParser)('[hello world]')).toEqual(['hello world', '']);
        });

        it('should fail with unmatched brackets', () => {
            const contentParser = literal('hello world');
            expect(bracketed(contentParser)('[hello world')).toBeNull();
        });

        it('should handle empty brackets', () => {
            const contentParser = literal('');
            expect(bracketed(contentParser)('[]')).toEqual(['', '']);
        });
    });
    describe('integration tests', () => {
        it('should handle complex quoted strings', () => {
            const stringContent = regex(/[^"|']*/);
            const quotedString = quoted(stringContent);

            expect(quotedString('"Hello, World!"')).toEqual(['Hello, World!', '']);
            expect(quotedString("'Single quotes'")).toEqual(['Single quotes', '']);
        });

        it('should parse nested structures', () => {
            const nestedContent = regex(/[^(){}[\]]*/);

            expect(parenthesized(nestedContent)('(inner content)')).toEqual(['inner content', '']);
            expect(braced(nestedContent)('{inner content}')).toEqual(['inner content', '']);
            expect(bracketed(nestedContent)('[inner content]')).toEqual(['inner content', '']);
        });
    });
});
